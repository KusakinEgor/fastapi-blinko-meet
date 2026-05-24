use axum::{
    extract::{ws::{WebSocketUpgrade, Message, WebSocket}, Path, State},
    response::IntoResponse,
    Json,
};
use futures::{StreamExt, SinkExt};
use std::sync::Arc;
use serde::{Deserialize, Serialize};

use crate::state::{AppState, Participant, ParticipantInfo};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct SignalMessage {
    #[serde(rename = "type")]
    msg_type: String,
    #[serde(default)]
    sender_id: String,
    target_id: Option<String>,
    payload: serde_json::Value,
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

    let (tx, mut rx) = tokio::sync::broadcast::channel::<String>(100);

    {
        let mut rooms = state.rooms.lock().await;
        let participants = rooms.entry(room_id.clone()).or_insert_with(Vec::new);

        participants.retain(|p| p.user_id != user_id);

        let new_participant = Arc::new(Participant {
            user_id: user_id.clone(),
            username: user_id.clone(),
            sender: tx.clone(),
        });

        participants.push(new_participant);
        println!("Пользователь [{}] вошел в комнату [{}]", user_id, room_id);

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
        while let Ok(msg) = rx.recv().await {
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
            if let Ok(mut signal) = serde_json::from_str::<SignalMessage>(&text) {
                signal.sender_id = user_id_clone.clone();

                let rooms = state_clone.rooms.lock().await;
                if let Some(participants) = rooms.get(&room_id_clone) {
                    let encoded_msg = serde_json::to_string(&signal).unwrap();

                    if let Some(target) = &signal.target_id {
                        if let Some(p) = participants.iter().find(|p| &p.user_id == target) {
                            let _ = p.sender.send(encoded_msg);
                        }
                    } else {
                        for p in participants.iter() {
                            if p.user_id != user_id_clone {
                                let _ = p.sender.send(encoded_msg.clone());
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

    let mut rooms = state.rooms.lock().await;
    if let Some(participants) = rooms.get_mut(&room_id) {
        participants.retain(|p| p.user_id != user_id);
        println!("Пользователь [{}] покинул комнату [{}]", user_id, room_id);

        let leave_msg = serde_json::json!({
            "type": "user_left",
            "sender_id": user_id
        }).to_string();

        for p in participants.iter() {
            let _ = p.sender.send(leave_msg.clone());
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
