use axum::{extract::State, Json};
use axum::extract::Path;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};

use crate::state::{AppState, Participant, ParticipantInfo};
use crate::rtc::peer::create_peer;
use crate::rtc::track::setup_on_track;

use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::rtp_transceiver::{
    rtp_codec::RTPCodecType,
    rtp_transceiver_direction::RTCRtpTransceiverDirection,
    RTCRtpTransceiverInit,
};
use webrtc::track::track_local::TrackLocal;

#[derive(Serialize, Deserialize, Clone)]
pub struct Sdp {
    pub sdp: String,
    pub room_id: String,
    pub user_id: String,
    pub username: Option<String>,
}

pub async fn handle_offer(
    State(state): State<Arc<AppState>>,
    Json(offer): Json<Sdp>,
) -> Json<Sdp> {
    let room_id = offer.room_id.clone();
    let user_id = offer.user_id.clone();
    let username = offer.username.clone().unwrap_or_else(|| user_id.clone());

    println!("/. NEW OFFER ./ room: {}, user: {}", room_id, user_id);
    println!("SPD len: {}", offer.sdp.len());

    let mut rooms = state.rooms.lock().await;
    let mut participants = rooms.entry(room_id.clone()).or_insert_with(Vec::new);

    let mut removed = false;
    let mut i = 0;
    while i < participants.len() {
        if participants[i].user_id == user_id {
            println!("🧹 Найдена висящая сессия для {}, жестко удаляем...", user_id);
            let old_p = participants.remove(i);
            let _ = old_p.pc.close().await;
            removed = true;
        } else {
            i += 1;
        }
    }

    if removed {
        drop(participants);
        drop(rooms);

        tokio::time::sleep(std::time::Duration::from_millis(100)).await;

        rooms = state.rooms.lock().await;
        participants = rooms.entry(room_id.clone()).or_insert_with(Vec::new);
    }

    println!("Creating new participant: {}", user_id);
    let pc = create_peer(&state.api).await;

    pc.add_transceiver_from_kind(
        RTPCodecType::Video,
        Some(RTCRtpTransceiverInit {
            direction: RTCRtpTransceiverDirection::Sendrecv,
            send_encodings: vec![],
        }),
    ).await.unwrap();

    let (tx, _) = broadcast::channel(64);

    let participant = Arc::new(Participant {
        user_id: user_id.clone(),
        username: username.clone(),
        pc: pc.clone(),
        sender: tx,
        published_tracks: Mutex::new(Vec::new()),
    });

    let tx_clone = participant.sender.clone();
    pc.on_ice_candidate(Box::new(move |c| {
        let tx = tx_clone.clone();
        Box::pin(async move {
            if let Some(c) = c {
                println!("ICE candidate generated");
                let msg = serde_json::json!({
                    "type": "candidate",
                    "candidate": c.to_json().unwrap()
                }).to_string();
                let _ = tx.send(msg);
            }
        })
    }));

    setup_on_track(
        &pc,
        state.clone(),
        room_id.clone(),
        user_id.clone(),
        participant.clone(),
    );


    println!("Setting remote description");

    let remote = RTCSessionDescription::offer(offer.sdp.clone()).unwrap();
    pc.set_remote_description(remote).await.unwrap();

    println!("Creating answer");

    let answer = pc.create_answer(None).await.unwrap();

    println!("ANSWER SDP:\n{}", answer.sdp);

    pc.set_local_description(answer.clone()).await.unwrap();

    println!("ANSWER ready");

    for other in participants.iter() {
        let tracks = other.published_tracks.lock().await;
        for track in tracks.iter() {
            let track_clone = Arc::clone(track) as Arc<dyn TrackLocal + Send + Sync>;
            if let Ok(_) = pc.add_track(track_clone).await {
                println!("➕ Добавлен трек старого участника {} для нового юзера {}", other.user_id, user_id);

                let pc_clone = pc.clone();
                let sender_clone = participant.sender.clone();
                tokio::spawn(async move {
                    tokio::time::sleep(std::time::Duration::from_millis(200)).await;
                    if let Ok(offer) = pc_clone.create_offer(None).await {
                        if pc_clone.set_local_description(offer.clone()).await.is_ok() {
                            let msg = serde_json::json!({"type": "offer", "sdp": offer.sdp}).to_string();
                            let _ = sender_clone.send(msg);
                            println!("🚀 [Offer] Пересогласование (Renegotiation) запущено");
                        }
                    }
                });
            }
        }
    }

    participants.push(participant.clone());

    let users_data: Vec<serde_json::Value> = participants.iter().map(|p| {
        serde_json::json!({
            "user_id": p.user_id.clone(),
            "username": p.username.clone()
        })
    }).collect();

    let update_msg = serde_json::json!({
        "type": "participants_update",
        "users": users_data
    }).to_string();

    for p in participants.iter() {
        let _ = p.sender.send(update_msg.clone());
    }

    Json(Sdp {
        sdp: answer.sdp,
        room_id,
        user_id,
        username: Some(participant.username.clone()),
    })
}

pub async fn get_participants(
    State(state): State<Arc<AppState>>,
    Path(room_id): Path<String>,
) -> Json<Vec<ParticipantInfo>> {
    let rooms = state.rooms.lock().await;
    let users = rooms.get(&room_id)
        .map(|list| {
            list.iter().map(|p| ParticipantInfo {
                user_id: p.user_id.clone(),
                username: p.username.clone(),
            }).collect()
        })
        .unwrap_or_default();
    Json(users)
}
