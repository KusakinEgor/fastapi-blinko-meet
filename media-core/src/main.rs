use axum::{extract::{State, Path}, routing::{post, get}, Json, Router, response::IntoResponse};
use axum::extract::ws::{ Message, WebSocket, WebSocketUpgrade };
use futures::{sink::SinkExt, stream::StreamExt};
use tokio::sync::mpsc;
use serde::{Deserialize, Serialize};
use webrtc::rtcp::payload_feedbacks::picture_loss_indication;
use webrtc::track::track_local::TrackLocalWriter;
use std::sync::Arc;
use std::collections::HashMap;
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use webrtc::api::media_engine::MediaEngine;
use webrtc::api::{APIBuilder, API};
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::RTCPeerConnection;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::track::track_local::track_local_static_rtp::TrackLocalStaticRTP;
use webrtc::track::track_local::TrackLocal;
use tokio::sync::{broadcast};

#[derive(Serialize, Deserialize)]
struct Sdp {
    sdp: String,
    room_id: String,
}

struct Participant {
    pc: Arc<RTCPeerConnection>,
    sender: broadcast::Sender<Message>,
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
        .route("/ws/:room_id", get(ws_handler))
        .layer(CorsLayer::permissive())
        .with_state(shared_state);

    println!("Server start on http://127.0.0.1:3000");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    Path(room_id): Path<String>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    println!("Try Ws connection to room: {}", room_id);
    ws.on_upgrade(move |socket| async move {
        let (mut sender, _) = socket.split();

        let mut rooms = state.rooms.lock().await;

        if let Some(participants) = rooms.get_mut(&room_id) {
            if let Some(p) = participants.last() {
                let mut rx = p.sender.subscribe();
                drop(rooms);

                println!("WS connected to client in room {}", room_id);

                while let Ok(msg) = rx.recv().await {
                    if sender.send(msg).await.is_err() { break; }
                }
            }
        }
    })
}

async fn handle_offer(
    State(state): State<Arc<AppState>>, 
    Json(offer): Json<Sdp>
) -> Json<Sdp> {
    let room_id_clone = offer.room_id.clone();
    let state_clone = Arc::clone(&state);

    let config = RTCConfiguration::default();
    let peer_connection = Arc::new(state.api.new_peer_connection(config).await.unwrap());

    let pc_for_track = Arc::clone(&peer_connection);
    let (tx, _rx) = broadcast::channel(16);

    peer_connection.on_track(Box::new(move |track, _, _| {
        let room_id = room_id_clone.clone();
        let state = Arc::clone(&state_clone);
        let pc_local = Arc::clone(&pc_for_track);

        Box::pin(async move {
            println!("Track in room {}: Kind={}, ID={}", room_id, track.kind(), track.id());

            let output_track = Arc::new(TrackLocalStaticRTP::new(
                    track.codec().capability,
                    track.id().to_string(),
                    track.stream_id().to_string(),
            ));

            let participants_to_notify = {
                let rooms = state.rooms.lock().await;
                rooms.get(&room_id).cloned().unwrap_or_default()
            };

            for p in participants_to_notify {
                if Arc::ptr_eq(&p.pc, &pc_local) { continue; }

                if let Err(e) = p.pc.add_track(Arc::clone(&output_track) as Arc<dyn TrackLocal + Send + Sync>).await {
                    println!("Error adding track: {}", e);
                    continue;
                }

                let _ = p.sender.send(Message::Text("update_needed".into()));
            }

            let mut b = vec![0u8; 1500];
            while let Ok((rtp_packet, _)) = track.read(&mut b).await {
                if let Err(e) = output_track.write_rtp(&rtp_packet).await {
                    println!("Relay error: {}", e);
                    break;
                }
            }
            println!("Track {} stopped", track.id());
        })
    }));

    let session_desc = RTCSessionDescription::offer(offer.sdp).unwrap();
    peer_connection.set_remote_description(session_desc).await.unwrap();

    let answer = peer_connection.create_answer(None).await.unwrap();
    peer_connection.set_local_description(answer.clone()).await.unwrap();

    let mut rooms = state.rooms.lock().await;

    let new_participant = Arc::new(Participant {
        pc: Arc::clone(&peer_connection),
        sender: tx,
    });

    rooms.entry(offer.room_id.clone())
        .or_insert_with(Vec::new)
        .push(Arc::clone(&new_participant));

    println!("User joined room: {}. Total in room: {}", offer.room_id, rooms.get(&offer.room_id).unwrap().len());

    Json(Sdp {
        sdp: answer.sdp,
        room_id: offer.room_id,
    })
}

