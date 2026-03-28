use axum::{extract::State, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::collections::HashMap;
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use webrtc::api::media_engine::MediaEngine;
use webrtc::api::{APIBuilder, API};
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::RTCPeerConnection;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;

#[derive(Serialize, Deserialize)]
struct Sdp {
    sdp: String,
    room_id: String,
}

struct AppState {
    api: API,
    rooms: Mutex<HashMap<String, Vec<Arc<RTCPeerConnection>>>>,
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
        .layer(CorsLayer::permissive())
        .with_state(shared_state);

    println!("Server start on http://127.0.0.1:3000");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn handle_offer(
    State(state): State<Arc<AppState>>, 
    Json(offer): Json<Sdp>
) -> Json<Sdp> {
    let room_id_clone = offer.room_id.clone();
    let config = RTCConfiguration::default();
    
    let peer_connection = Arc::new(state.api.new_peer_connection(config).await.unwrap());

    peer_connection.on_track(Box::new(move |track, _, _| {
        let room_id = room_id_clone.clone();

        Box::pin(async move {
            println!("Track in room {}: Kind={}, ID={}", room_id, track.kind(), track.id());
        })
    }));

    let session_desc = RTCSessionDescription::offer(offer.sdp).unwrap();
    peer_connection.set_remote_description(session_desc).await.unwrap();

    let answer = peer_connection.create_answer(None).await.unwrap();
    peer_connection.set_local_description(answer.clone()).await.unwrap();

    let mut rooms = state.rooms.lock().await;
    rooms.entry(offer.room_id.clone())
        .or_insert_with(Vec::new)
        .push(Arc::clone(&peer_connection));

    println!("User joined room: {}. Total in room: {}", offer.room_id, rooms.get(&offer.room_id).unwrap().len());

    Json(Sdp {
        sdp: answer.sdp,
        room_id: offer.room_id,
    })
}

