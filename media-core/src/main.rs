use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use webrtc::api::media_engine::MediaEngine;
use webrtc::api::APIBuilder;
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;

#[derive(Serialize, Deserialize)]
struct Sdp {
    sdp: String,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/offer", post(handle_offer))
        .layer(CorsLayer::permissive());

    println!("Server start on http://127.0.0.1:3000");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn handle_offer(Json(offer): Json<Sdp>) -> Json<Sdp> {
    let mut m = MediaEngine::default();
    m.register_default_codecs().unwrap();

    let api = APIBuilder::new().with_media_engine(m).build();

    let config = RTCConfiguration::default();
    let peer_connection = Arc::new(api.new_peer_connection(config).await.unwrap());

    let session_desc = RTCSessionDescription::offer(offer.sdp).unwrap();
    peer_connection.set_remote_description(session_desc).await.unwrap();

    let answer = peer_connection.create_answer(None).await.unwrap();

    peer_connection.set_local_description(answer.clone()).await.unwrap();

    Json(Sdp {
        sdp: answer.sdp,
    })
}
