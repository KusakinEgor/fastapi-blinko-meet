mod state;
mod handlers;
mod rtc;

use axum::{Router, routing::{get, post}};
use std::{sync::Arc, collections::HashMap};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;

use state::AppState;
use handlers::{offer::handle_offer, ws_handler::ws_handler};

use webrtc::api::media_engine::MediaEngine;
use webrtc::api::{APIBuilder, API};

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
    println!("Server started: {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

