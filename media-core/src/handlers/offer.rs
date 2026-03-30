use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};

use crate::state::{AppState, Participant};
use crate::rtc::peer::create_peer;
use crate::rtc::track::setup_on_track;

use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;

#[derive(Serialize, Deserialize, Clone)]
pub struct Sdp {
    pub sdp: String,
    pub room_id: String,
    pub user_id: String,
}

pub async fn handle_offer(
    State(state): State<Arc<AppState>>,
    Json(offer): Json<Sdp>,
) -> Json<Sdp> {
    let room_id = offer.room_id.clone();
    let user_id = offer.user_id.clone();

    println!("/. NEW OFFER ./");
    println!("room: {}, user: {}", room_id, user_id);
    println!("SPD len: {}", offer.sdp.len());

    let mut rooms = state.rooms.lock().await;
    let participants = rooms.entry(room_id.clone()).or_insert_with(Vec::new);

    let participant = if let Some(p) = participants.iter().find(|p| p.user_id == user_id) {
        println!("Existing participant");
        p.clone()
    } else {
        println!("Creating new participant");

        let pc = create_peer(&state.api).await;

        let (tx, _) = broadcast::channel(64);

        let new_p = Arc::new(Participant {
            user_id: user_id.clone(),
            pc: pc.clone(),
            sender: tx,
            published_tracks: Mutex::new(Vec::new()),
        });

        // ICE
        let tx_clone = new_p.sender.clone();
        pc.on_ice_candidate(Box::new(move |c| {
            let tx = tx_clone.clone();
            Box::pin(async move {
                if let Some(c) = c {
                    println!("ICE crandidate generated");

                    let msg = serde_json::json!({
                        "type": "candidate",
                        "candidate": c.to_json().unwrap()
                    }).to_string();
                    let _ = tx.send(msg);
                }
            })
        }));

        // TRACK
        setup_on_track(
            &pc,
            state.clone(),
            room_id.clone(),
            user_id.clone(),
            new_p.clone(),
        );

        participants.push(new_p.clone());
        new_p
    };

    let pc = &participant.pc;

    println!("Setting remote description");

    let remote = RTCSessionDescription::offer(offer.sdp.clone()).unwrap();
    pc.set_remote_description(remote).await.unwrap();

    println!("Creating answer");

    let answer = pc.create_answer(None).await.unwrap();
    pc.set_local_description(answer.clone()).await.unwrap();

    println!("ANSWER ready");

    Json(Sdp {
        sdp: answer.sdp,
        room_id,
        user_id,
    })
}
