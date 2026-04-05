use std::sync::Arc;
use crate::state::{AppState, Participant};

use webrtc::{
    track::track_local::track_local_static_rtp::TrackLocalStaticRTP,
    track::track_local::TrackLocal,
    track::track_local::TrackLocalWriter,
    peer_connection::RTCPeerConnection,
};

pub fn setup_on_track(
    pc: &Arc<RTCPeerConnection>,
    state: Arc<AppState>,
    room_id: String,
    user_id: String,
    participant: Arc<Participant>,
) {
    pc.on_track(Box::new(move |track, receiver, _| {
        println!("/. TRACK RECEIVED ./");
        println!("kind: {:?}", track.kind());
        println!("id: {}", track.id());
        println!("stream_id: {}", track.stream_id());

        let state = state.clone();
        let room_id = room_id.clone();
        let user_id = user_id.clone();
        let participant = participant.clone();

        Box::pin(async move {
            println!("Creating local track");
            println!("TRACK RECEIVED: {:?}", track.kind());

            let local_track = Arc::new(TrackLocalStaticRTP::new(
                track.codec().capability,
                track.id().to_string(),
                track.stream_id().to_string(),
            ));

            participant.published_tracks.lock().await.push(local_track.clone());

            let others = {
                let rooms = state.rooms.lock().await;
                rooms.get(&room_id).cloned().unwrap_or_default()
            };

            for other in others {
                if other.user_id != user_id {

                    let pc = other.pc.clone();
                    let sender = other.sender.clone();
                    let track_clone = local_track.clone() as Arc<dyn TrackLocal + Send + Sync>;

                    tokio::spawn(async move {
                        println!("Adding track to peer");
                        if pc.add_track(track_clone).await.is_ok() {
                            println!("Creating renegotiation offer");

                            let offer = pc.create_offer(None).await.unwrap();
                            pc.set_local_description(offer.clone()).await.unwrap();

                            let msg = serde_json::json!({
                                "type": "offer",
                                "sdp": offer.sdp
                            }).to_string();

                            let _ = sender.send(msg);
                        }
                    });
                }
            }

            let receiver = receiver.clone();

            tokio::spawn(async move {
                println!("Starting RTCP reader");

                loop {
                    match receiver.read_rtcp().await {
                        Ok((pkts, _)) => {
                            for pkt in pkts {
                                println!("RTCP type: {}", pkt.header().packet_type);
                                println!("RTCP packet: {:?}", pkt);
                            }
                        }
                        Err(e) => {
                            eprintln!("RTCP read error: {:?}. Stopping reader.", e);
                            break;
                        }
                    }
                }
            });

            println!("Start RTP forwarding");

            while let Ok((rtp, _)) = track.read_rtp().await {
                let _ = local_track.write_rtp(&rtp).await;
            }
        })
    }));
}
