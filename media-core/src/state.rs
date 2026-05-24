use serde::Serialize;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::{Mutex, broadcast};

pub struct Participant {
    pub user_id: String,
    pub username: String,
    pub sender: broadcast::Sender<String>,
}

pub struct AppState {
    pub rooms: Mutex<HashMap<String, Vec<Arc<Participant>>>>,
}

#[derive(Serialize)]
pub struct ParticipantInfo {
    pub user_id: String,
    pub username: String,
}
