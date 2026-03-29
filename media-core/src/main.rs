use axum::{
    extract::{Path, State, ws::{Message, WebSocket, WebSocketUpgrade}},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use futures::{sink::SinkExt, stream::StreamExt};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};
use tower_http::cors::CorsLayer;
use webrtc::api::media_engine::MediaEngine;
use webrtc::api::{APIBuilder, API};
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::peer_connection::RTCPeerConnection;
use webrtc::track::track_local::track_local_static_rtp::TrackLocalStaticRTP;
use webrtc::track::track_local::TrackLocal;
use webrtc::track::track_local::TrackLocalWriter;
use webrtc::rtp_transceiver::rtp_codec::RTPCodecType;
use webrtc::rtp_transceiver::rtp_transceiver_direction::RTCRtpTransceiverDirection;
use webrtc::rtp_transceiver::RTCRtpTransceiverInit;

#[derive(Serialize, Deserialize, Clone)]
struct Sdp {
    sdp: String,
    room_id: String,
    user_id: String,
}

struct Participant {
    user_id: String,
    pc: Arc<RTCPeerConnection>,
    sender: broadcast::Sender<String>,
    published_tracks: Mutex<Vec<Arc<TrackLocalStaticRTP>>>,
}

struct AppState {
    api: API,
    rooms: Mutex<HashMap<String, Vec<Arc<Participant>>>>,
}

#[tokio::main]
async fn main() {
    let mut m = MediaEngine::default();
    m.register_default_codecs().unwrap();
    let api = APIBuilder::new().with_media_engine(m).build();

    let shared_state = Arc::new(AppState {
        api,
        rooms: Mutex::new(HashMap::new()),
    });

    let app = Router::new()
        .route("/offer", post(handle_offer))
        .route("/ws/:room_id/:user_id", get(ws_handler))
        .layer(CorsLayer::permissive())
        .with_state(shared_state);

    let addr = "127.0.0.1:3000";
    println!("WebRTC Server Started on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    Path((room_id, user_id)): Path<(String, String)>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| async move {
        let (mut sink, mut stream) = socket.split();
        let rx = {
            let rooms = state.rooms.lock().await;
            rooms.get(&room_id).and_then(|list| {
                list.iter().find(|p| p.user_id == user_id).map(|p| p.sender.subscribe())
            })
        };

        if let Some(mut rx) = rx {
            println!("WS connected: {}", user_id);
            tokio::spawn(async move {
                while let Ok(msg) = rx.recv().await {
                    if sink.send(Message::Text(msg)).await.is_err() { break; }
                }
            });
        }
        while let Some(Ok(_)) = stream.next().await {}
    })
}

async fn handle_offer(State(state): State<Arc<AppState>>, Json(offer): Json<Sdp>) -> Json<Sdp> {
    let room_id = offer.room_id.clone();
    let user_id = offer.user_id.clone();
    println!("Offer from: {}", user_id);

    let mut rooms = state.rooms.lock().await;
    let participants = rooms.entry(room_id.clone()).or_insert_with(Vec::new);

    let participant = if let Some(p) = participants.iter().find(|p| p.user_id == user_id) {
        p.clone()
    } else {
        let pc = Arc::new(state.api.new_peer_connection(RTCConfiguration::default()).await.unwrap());
        let (tx, _) = broadcast::channel(64);
        
        for kind in [RTPCodecType::Audio, RTPCodecType::Video] {
            let _ = pc.add_transceiver_from_kind(kind, Some(RTCRtpTransceiverInit {
                direction: RTCRtpTransceiverDirection::Recvonly,
                send_encodings: vec![],
            })).await;
        }

        let new_p = Arc::new(Participant {
            user_id: user_id.clone(),
            pc: Arc::clone(&pc),
            sender: tx,
            published_tracks: Mutex::new(Vec::new()),
        });

        let tx_ice = new_p.sender.clone();
        pc.on_ice_candidate(Box::new(move |candidate| {
            let tx = tx_ice.clone();
            Box::pin(async move {
                if let Some(c) = candidate {
                    let json = serde_json::json!({ "candidate": c.to_json().unwrap() }).to_string();
                    let _ = tx.send(json);
                }
            })
        }));

        let state_cb = Arc::clone(&state);
        let room_id_cb = room_id.clone();
        let user_id_cb = user_id.clone();
        let p_cb = Arc::clone(&new_p);

        pc.on_track(Box::new(move |track, receiver, _| {
            let state = Arc::clone(&state_cb);
            let room_id = room_id_cb.clone();
            let author_id = user_id_cb.clone();
            let p_author = Arc::clone(&p_cb);

            Box::pin(async move {
                println!("New track from {}: kind={}", author_id, track.kind());
                
                tokio::spawn(async move {
                    let mut b = vec![0u8; 1500];
                    while let Ok((_, _)) = receiver.read(&mut b).await {}
                });

                let local_track = Arc::new(TrackLocalStaticRTP::new(
                    track.codec().capability,
                    track.id().to_string(),
                    track.stream_id().to_string(),
                ));

                p_author.published_tracks.lock().await.push(Arc::clone(&local_track));

                let others = {
                    let rooms = state.rooms.lock().await;
                    rooms.get(&room_id).cloned().unwrap_or_default()
                };

                for other in others {
                    if other.user_id != author_id {
                        if let Ok(_) = other.pc.add_track(Arc::clone(&local_track) as Arc<dyn TrackLocal + Send + Sync>).await {
                            let _ = other.sender.send("update_needed".to_string());
                        }
                    }
                }

                while let Ok((rtp, _)) = track.read_rtp().await {
                    if local_track.write_rtp(&rtp).await.is_err() { break; }
                }
            })
        }));

        for existing in participants.iter() {
            let tracks = existing.published_tracks.lock().await;
            for track in tracks.iter() {
                let _ = pc.add_track(Arc::clone(track) as Arc<dyn TrackLocal + Send + Sync>).await;
            }
        }

        participants.push(Arc::clone(&new_p));
        new_p
    };

    let pc = &participant.pc;
    pc.set_remote_description(RTCSessionDescription::offer(offer.sdp).unwrap()).await.unwrap();
    let answer = pc.create_answer(None).await.unwrap();
    pc.set_local_description(answer.clone()).await.unwrap();

    Json(Sdp { sdp: answer.sdp, room_id, user_id })
}

