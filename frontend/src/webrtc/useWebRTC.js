import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling } from "./signaling";

export function useWebRTC({ localStream, roomId, userId }) {
	const peers = useRef(new Map());
	const socket = useRef(null);
	const iceQueue = useRef([]);
	const [remoteStreams, setRemoteStreams] = useState([]);

	const initPeerConnection = (targetId, wsInstance) => {
		if (peers.current.has(targetId)) {
			return peers.current.get(targetId);
		}

		console.log(`🛠️ Создаем PeerConnection для: ${targetId}`);

		const pc = createPeer({
			localStream,
			onTrack: (stream) => {
				console.log(`📥 Получен удаленный стрим от ${targetId}:`, stream.id);
				setRemoteStreams(prev => {
					if (prev.find(s => s.id === stream.id)) return prev;
					return [...prev, stream];
				});
			},
			onIceCandidate: (candidate) => {
				const message = JSON.stringify({
					type: "candidate",
					target_id: targetId,
					payload: candidate
				});

				const activeWs = wsInstance || socket.current;
				if (activeWs && activeWs.readyState === WebSocket.OPEN) {
					activeWs.send(message);
				} else {
					iceQueue.current.push(message);
				}
			}
		});

		peers.current.set(targetId, pc);
		return pc;
	};

	useEffect(() => {
		if (!localStream || !roomId || !userId) return;

		console.log("🔌 Подключаемся к сигнальному серверу...");
		const ws = createSignaling({
			roomId,
			userId,
			onMessage: async (data) => {
				const { type, sender_id, payload } = data;
				
				const isPolite = userId < sender_id;

				if (type === "user_joined") {
					console.log(`👋 Юзер ${sender_id} зашел в комнату`);
					
					if (peers.current.has(sender_id)) {
						peers.current.get(sender_id).close();
						peers.current.delete(sender_id);
						setRemoteStreams(prev => prev.filter(s => s.id !== sender_id));
					}

					const pc = initPeerConnection(sender_id, ws);

					if (!isPolite) {
						try {
							console.log(`📡 Отправляем локальный Offer для ${sender_id}...`);
							const offer = await pc.createOffer();
							await pc.setLocalDescription(offer);
							ws.send(JSON.stringify({ type: "offer", target_id: sender_id, payload: offer }));
						} catch (err) {
							console.error("❌ Ошибка генерации Offer:", err);
						}
					}
				}

				if (type === "offer") {
					console.log(`📥 Получен входящий Offer от ${sender_id}`);
					const pc = initPeerConnection(sender_id, ws);

					try {
						const collision = pc.signalingState !== "stable" || pc.localDescription;
						if (collision && !isPolite) {
							console.log(`⚠️ Коллизия! Игнорируем оффер от ${sender_id}`);
							return;
						}

						await pc.setRemoteDescription(new RTCSessionDescription(payload));
						const answer = await pc.createAnswer();
						await pc.setLocalDescription(answer);

						console.log(`📡 Отправляем Answer для ${sender_id}...`);
						ws.send(JSON.stringify({ type: "answer", target_id: sender_id, payload: answer }));
					} catch (err) {
						console.error("❌ Ошибка обработки входящего оффера:", err);
					}
				}

				if (type === "answer") {
					console.log(`📥 Получен Answer от ${sender_id}`);
					const pc = peers.current.get(sender_id);
					if (pc) {
						try {
							await pc.setRemoteDescription(new RTCSessionDescription(payload));
						} catch (err) {
							console.error("❌ Ошибка установки Remote Answer:", err);
						}
					}
				}

				if (type === "candidate") {
					const pc = peers.current.get(sender_id);
					if (pc && payload) {
						try {
							await pc.addIceCandidate(new RTCIceCandidate(payload));
						} catch (e) {
							console.warn("[WebRTC] Ошибка добавления кандидата:", e);
						}
					}
				}

				if (type === "user_left") {
					console.log(`❌ Юзер ${sender_id} покинул комнату`);
					const pc = peers.current.get(sender_id);
					if (pc) {
						pc.close();
						peers.current.delete(sender_id);
					}
					setRemoteStreams(prev => prev.filter(s => s.id !== sender_id));
				}

				if (type === "participants_update") window.dispatchEvent(new CustomEvent("webrtc_event", { detail: data }));
				if (type === "chat_message") window.dispatchEvent(new CustomEvent("chat_message", { detail: data }));
				if (type === "emoji_reaction") window.dispatchEvent(new CustomEvent("emoji_reaction", { detail: data }));
			},
			onOpen: () => {
				iceQueue.current.forEach(msg => ws.send(msg));
				iceQueue.current = [];
			}
		});

		socket.current = ws;

		return () => {
			peers.current.forEach(pc => pc.close());
			peers.current.clear();
			if (socket.current) {
				socket.current.onclose = null;
				socket.current.close();
				socket.current = null;
			}
		};
	}, [localStream, roomId, userId]); 

	useEffect(() => {
		const interval = setInterval(() => {
			if (socket.current && socket.current.readyState === WebSocket.OPEN) {
				socket.current.send(JSON.stringify({ type: "ping" }));
			}
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	const sendMessage = (messageObj) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			socket.current.send(JSON.stringify(messageObj));
		}
	}

	return {
		remoteStreams,
		sendMessage
	};
}

