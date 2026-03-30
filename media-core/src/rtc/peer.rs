use std::sync::Arc;
use webrtc::{
    api::API,
    peer_connection::{RTCPeerConnection, configuration::RTCConfiguration},
};

pub async fn create_peer(api: &API) -> Arc<RTCPeerConnection> {
    println!("Creating PeerConnection");
    Arc::new(
        api.new_peer_connection(RTCConfiguration::default()).await.unwrap()
    )
}
