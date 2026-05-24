mod state;
mod handlers;

use axum::{Router, routing::get};
use std::{sync::Arc, collections::HashMap};
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};
use axum::http::Method;

use state::AppState;
use handlers::ws_handler::{ws_handler, get_participants};

#[tokio::main]
async fn main() {
    let shared_state = Arc::new(AppState {
        rooms: Mutex::new(HashMap::new()),
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/ws/:room_id/:user_id", get(ws_handler))
        .route("/rooms/:room_id/participants", get(get_participants))
        .layer(cors)
        .with_state(shared_state);

    let addr = "0.0.0.0:3000";
    println!("Сервер запущен на: {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
