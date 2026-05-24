use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, State,
    },
    response::IntoResponse,
    Json,
};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::state::{AppState, Participant, ParticipantInfo};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct SignalMessage {
    #[serde(rename = "type")]
    msg_type: String,
    #[serde(default)]
    sender_id: String,
    target_id: Option<String>,
    payload: Option<serde_json::Value>,
}

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    Path((room_id, user_id)): Path<(String, String)>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, room_id, user_id, state))
}

async fn handle_socket(socket: WebSocket, room_id: String, user_id: String, state: Arc<AppState>) {
    let (mut ws_sender, mut ws_receiver) = socket.split();
    let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<String>();

    let current_participant = Arc::new(Participant {
        user_id: user_id.clone(),
        username: user_id.clone(),
        sender: tx.clone(),
    });

    {
        let mut rooms = state.rooms.lock().await;
        let participants = rooms.entry(room_id.clone()).or_insert_with(Vec::new);

        participants.retain(|p| p.user_id != user_id);
        participants.push(current_participant.clone());

        println!("✅ [{}] вошел в комнату [{}]", user_id, room_id);

        let join_msg = serde_json::json!({
            "type": "user_joined",
            "sender_id": user_id.clone()
        }).to_string();

        for p in participants.iter() {
            if p.user_id != user_id {
                let _ = p.sender.send(join_msg.clone());
            }
        }
    }

    let mut send_task = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if ws_sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let state_clone = state.clone();
    let room_id_clone = room_id.clone();
    let user_id_clone = user_id.clone();

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(text))) = ws_receiver.next().await {
            let mut signal = match serde_json::from_str::<SignalMessage>(&text) {
                Ok(v) => v,
                Err(_) => continue,
            };

            signal.sender_id = user_id_clone.clone();
            let encoded = serde_json::to_string(&signal).unwrap();

            let rooms = state_clone.rooms.lock().await;
            if let Some(participants) = rooms.get(&room_id_clone) {
                if let Some(target_id) = &signal.target_id {
                    // Адресная отправка конкретному участнику
                    if let Some(target) = participants.iter().find(|p| &p.user_id == target_id) {
                        let _ = target.sender.send(encoded);
                    }
                } else {
                    for p in participants.iter() {
                        if p.user_id != user_id_clone {
                            let _ = p.sender.send(encoded.clone());
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

    {
        let mut rooms = state.rooms.lock().await;
        if let Some(participants) = rooms.get_mut(&room_id) {
            let is_same = participants.iter().any(|p| Arc::ptr_eq(p, &current_participant));

            if is_same {
                participants.retain(|p| !Arc::ptr_eq(p, &current_participant));
                println!("❌ [{}] покинул комнату [{}]", user_id, room_id);

                let leave_msg = serde_json::json!({
                    "type": "user_left",
                    "sender_id": user_id.clone()
                }).to_string();

                for p in participants.iter() {
                    let _ = p.sender.send(leave_msg.clone());
                }
            }

            if participants.is_empty() {
                rooms.remove(&room_id);
                println!("🗑️ Комната [{}] пуста и удалена", room_id);
            }
        }
    }
}

pub async fn get_participants(
    State(state): State<Arc<AppState>>,
    Path(room_id): Path<String>,
) -> Json<Vec<ParticipantInfo>> {
    let rooms = state.rooms.lock().await;
    let users = rooms.get(&room_id)
        .map(|list| {
            list.iter().map(|p| ParticipantInfo {
                user_id: p.user_id.clone(),
                username: p.username.clone(),
            }).collect()
        })
        .unwrap_or_default();
    Json(users)
}

