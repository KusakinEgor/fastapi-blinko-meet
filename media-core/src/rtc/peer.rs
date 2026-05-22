use std::sync::Arc;
use webrtc::{
    api::API,
    peer_connection::{RTCPeerConnection, configuration::RTCConfiguration},
    ice_transport::ice_server::RTCIceServer,
};

pub async fn create_peer(api: &API) -> Arc<RTCPeerConnection> {
    println!("Creating PeerConnection with NAT Engine Configuration");

    let config = RTCConfiguration {
        ice_servers: vec![
            RTCIceServer {
                urls: vec!["stun:stun.l.google.com:19302".to_string()],
                ..Default::default()
            }
        ],
        ..Default::default()
    };
    
    Arc::new(
        api.new_peer_connection(config).await.unwrap()
    )
}
