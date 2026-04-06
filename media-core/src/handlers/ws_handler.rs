use axum::{
    extract::{ws::{WebSocketUpgrade, Message}, Path, State},
    response::IntoResponse,
};
use futures::{StreamExt, SinkExt};
use std::sync::Arc;

use crate::state::AppState;

use webrtc::{dtls::content, peer_connection::sdp::session_description::RTCSessionDescription};

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    Path((room_id, user_id)): Path<(String, String)>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {

    ws.on_upgrade(move |socket| async move {
        let (mut sink, mut stream) = socket.split();

        let mut participant = None;

        for _ in 0..50 {
            let rooms = state.rooms.lock().await;
            if let Some(p) = rooms.get(&room_id)
                .and_then(|list| list.iter().find(|p| p.user_id == user_id)) {
                participant = Some(p.clone());
                break;
            }
            drop(rooms);
            tokio::time::sleep(std::time::Duration::from_millis(100)).await;
        }

        let p = match participant {
            Some(p) => p,
            None => return,
        };

        let mut rx = p.sender.subscribe();

        // SEND
        let mut send_task = tokio::spawn(async move {
            while let Ok(msg) = rx.recv().await {
                if sink.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            }
        });

        // RECV
        let pc = p.pc.clone();

        let mut recv_task = tokio::spawn(async move {
            while let Some(Ok(Message::Text(text))) = stream.next().await {
                if let Ok(json) = serde_json::from_str::<serde_json::Value>(&text) {

                    if json["type"] == "candidate" {
                        let candidate = serde_json::from_value(json["candidate"].clone()).unwrap();
                        let _ = pc.add_ice_candidate(candidate).await;
                    }

                    if json["type"] == "answer" {
                        if let Some(sdp) = json["sdp"].as_str() {
                            let desc = RTCSessionDescription::answer(sdp.to_string()).unwrap();
                            let _ = pc.set_remote_description(desc).await;
                        }
                    }

                    if json["type"] == "chat_message" {
                        if let Some(content) = json["content"].as_str() {
                            let participants = {
                                let rooms = state.rooms.lock().await;
                                rooms.get(&room_id).cloned()
                            };

                            if let Some(participants) = participants {
                                let msg = serde_json::json!({
                                    "type": "chat_message",
                                    "user_id": user_id,
                                    "content": content
                                }).to_string();

                                for participant in participants {
                                    let _ = participant.sender.send(msg.clone());
                                }
                            }
                        }
                    }
                }
            }
        });

        tokio::select! {
            _ = &mut send_task => recv_task.abort(),
            _ = &mut recv_task => send_task.abort(),
        };
    })
}
