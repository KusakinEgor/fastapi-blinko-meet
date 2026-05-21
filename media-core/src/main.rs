mod state;
mod handlers;
mod rtc;

use axum::{Router, routing::{get, post}};
use std::{sync::Arc, collections::HashMap};
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};
use axum::http::Method;

use state::AppState;
use handlers::{offer::handle_offer, ws_handler::ws_handler};

use webrtc::api::media_engine::MediaEngine;
use webrtc::api::setting_engine::SettingEngine;
use webrtc::api::{APIBuilder, API};

#[tokio::main]
async fn main() {
    let mut m = MediaEngine::default();
    m.register_default_codecs().unwrap();

    let mut se = SettingEngine::default();

    se.set_nat_1to1_ips(
        vec!["77.110.125.7".to_string()],
        webrtc::ice_transport::ice_candidate_type::RTCIceCandidateType::Host,
    );

    let api = APIBuilder::new().with_media_engine(m).with_setting_engine(se).build();

    let shared_state = Arc::new(AppState {
        api,
        rooms: Mutex::new(HashMap::new()),
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/offer", post(handle_offer))
        .route("/ws/:room_id/:user_id", get(ws_handler))
        .route("/rooms/:room_id/participants", get(handlers::offer::get_participants))
        .layer(cors)
        .with_state(shared_state);

    let addr = "0.0.0.0:3000";
    println!("Server started: {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
