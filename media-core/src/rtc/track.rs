use std::sync::Arc;
use crate::state::{AppState, Participant};

use webrtc::{
    peer_connection::RTCPeerConnection, rtcp::payload_feedbacks::picture_loss_indication::PictureLossIndication, rtp_transceiver::rtp_sender, track::track_local::{TrackLocal, TrackLocalWriter, track_local_static_rtp::TrackLocalStaticRTP}
};

pub fn setup_on_track(
    pc: &Arc<RTCPeerConnection>,
    state: Arc<AppState>,
    room_id: String,
    user_id: String,
    participant: Arc<Participant>,
) {
    let pc_incoming = Arc::clone(pc);

    pc.on_track(Box::new(move |track, receiver, _| {
        println!("/. TRACK RECEIVED ./");
        println!("kind: {:?}", track.kind());
        println!("id: {}", track.id());
        println!("stream_id: {}", track.stream_id());

        let state = state.clone();
        let room_id = room_id.clone();
        let user_id = user_id.clone();
        let participant = participant.clone();
        let pc_incoming = pc_incoming.clone();

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
                    let pc_outgoing = other.pc.clone();
                    let signal_sender = other.sender.clone();
                    let track_clone = local_track.clone() as Arc<dyn TrackLocal + Send + Sync>;
                    let pc_incoming_for_pli = pc_incoming.clone();
                    let media_ssrc = track.ssrc();

                    tokio::spawn(async move {
                        if let Ok(rtp_sender) = pc_outgoing.add_track(track_clone).await {
                            let pc_incoming_for_loop = pc_incoming_for_pli.clone();
                            tokio::spawn(async move {
                                use webrtc::rtcp::payload_feedbacks::picture_loss_indication::PictureLossIndication;
                                loop {
                                    let pli = PictureLossIndication {
                                        sender_ssrc: 0,
                                        media_ssrc,
                                    };
                                    if pc_incoming_for_loop.write_rtcp(&[Box::new(pli)]).await.is_err() {
                                        break;
                                    }
                                    tokio::time::sleep(std::time::Duration::from_millis(1500)).await;
                                }
                            });

                            let pc_outgoing_clone = pc_outgoing.clone();
                            let signal_sender_clone = signal_sender.clone();
                            tokio::spawn(async move {
                                for _ in 0..10 {
                                    if pc_outgoing_clone.signaling_state() == webrtc::peer_connection::signaling_state::RTCSignalingState::Stable {
                                        if let Ok(offer) = pc_outgoing_clone.create_offer(None).await {
                                            if pc_outgoing_clone.set_local_description(offer.clone()).await.is_ok() {
                                                let msg = serde_json::json!({"type": "offer", "sdp": offer.sdp}).to_string();
                                                let _ = signal_sender_clone.send(msg);
                                                println!("🚀 [Track] Повторный Offer успешно отправлен для Renegotiation");
                                                break;
                                            }
                                        }
                                    }
                                    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                                }
                            });

                            tokio::spawn(async move {
                                while let Ok((rtcp_packets, _))= rtp_sender.read_rtcp().await {
                                    for pkt in rtcp_packets {
                                        if pkt.as_any().is::<PictureLossIndication>() {
                                            let pli = PictureLossIndication {
                                                sender_ssrc: 0,
                                                media_ssrc,
                                            };
                                            let _ = pc_incoming_for_pli.write_rtcp(&[Box::new(pli)]).await;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }

            println!("Start RTP forwarding for track {}", track.id());

            let track_for_spawn = track.clone();
            let local_track_for_spawn = local_track.clone();

            tokio::spawn(async move {
                let mut buf = vec![0u8; 1500];

                while let Ok((rtp_packet, _)) = track_for_spawn.read(&mut buf).await {
                    if local_track_for_spawn.write_rtp(&rtp_packet).await.is_err() {
                        println!("Forwarding stopped for track");
                        break;
                    }
                }
            });
        })
    }));
}
