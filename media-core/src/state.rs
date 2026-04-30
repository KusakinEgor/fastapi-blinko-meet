use serde::{Serialize};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::{Mutex, broadcast};
use webrtc::peer_connection::RTCPeerConnection;
use webrtc::track::track_local::track_local_static_rtp::TrackLocalStaticRTP;

pub struct Participant {
    pub user_id: String,
    pub username: String,
    pub pc: Arc<RTCPeerConnection>,
    pub sender: broadcast::Sender<String>,
    pub published_tracks: Mutex<Vec<Arc<TrackLocalStaticRTP>>>,
}

pub struct AppState {
    pub api: webrtc::api::API,
    pub rooms: Mutex<HashMap<String, Vec<Arc<Participant>>>>,
}

#[derive(Serialize)]
pub struct ParticipantInfo {
    pub user_id: String,
    pub username: String,
}
