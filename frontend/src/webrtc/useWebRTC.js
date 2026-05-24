import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling } from "./signaling";

export function useWebRTC({ localStream, roomId, userId }) {
	const peers = useRef(new Map());
	const socket = useRef(null);
	const iceQueue = useRef([]);
	const [remoteStreams, setRemoteStreams] = useState([]);

	const initPeerConnection = (targetId) => {
		if (peers.current.has(targetId)) {
			return peers.current.get(targetId);
		}

		const pc = createPeer({
			onTrack: (stream) => {
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
				if (socket.current?.readyState === WebSocket.OPEN) {
					socket.current.send(message);
				} else {
					iceQueue.current.push(message);
				}
			}
		});

		if (localStream) {
			localStream.getTracks().forEach(track => {
				console.log("➕ Добавляем трек:", track.kind, "для:", targetId);
				pc.addTransceiver(track, {
					direction: 'sendrecv',
					streams: [localStream]
				});
			});
		}

		peers.current.set(targetId, pc);
		return pc;
	};

	useEffect(() => {
		if (!localStream || !roomId || !userId) return;

		const ws = createSignaling({
			roomId,
			userId,
			onMessage: async (data) => {
				const { type, sender_id, payload } = data;
				const isPolite = userId < sender_id;

				if (type === "user_joined") {
					console.log(`🚀 Юзер ${sender_id} зашел.`);
					if (peers.current.has(sender_id)) {
						peers.current.get(sender_id).close();
						peers.current.delete(sender_id);
						setRemoteStreams(prev => prev.filter(s => s.id !== sender_id));
					}

					const pc = initPeerConnection(sender_id);

					// Оффер шлет только ОДИН (невежливый), предотвращая столкновение
					if (!isPolite) {
						try {
							const offer = await pc.createOffer();
							await pc.setLocalDescription(offer);
							ws.send(JSON.stringify({ type: "offer", target_id: sender_id, payload: offer }));
						} catch (err) {
							console.error("Ошибка Offer:", err);
						}
					}
				}

				if (type === "offer") {
					console.log(`📥 Оффер от ${sender_id}`);
					const pc = initPeerConnection(sender_id);
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(payload));
						const answer = await pc.createAnswer();
						await pc.setLocalDescription(answer);
						ws.send(JSON.stringify({ type: "answer", target_id: sender_id, payload: answer }));
					} catch (err) {
						console.error("Ошибка Answer:", err);
					}
				}

				if (type === "answer") {
					console.log(`📥 Ансвер от ${sender_id}`);
					const pc = peers.current.get(sender_id);
					if (pc) {
						await pc.setRemoteDescription(new RTCSessionDescription(payload));
					}
				}

				if (type === "candidate") {
					const pc = peers.current.get(sender_id);
					if (pc && payload) {
						try { await pc.addIceCandidate(new RTCIceCandidate(payload)); } catch (e) {}
					}
				}

				if (type === "user_left") {
					console.log(`❌ Юзер ${sender_id} вышел.`);
					const pc = peers.current.get(sender_id);
					if (pc) { pc.close(); peers.current.delete(sender_id); }
					setRemoteStreams(prev => prev.filter(s => s.id !== sender_id));
				}

				// Твои кастомные ивенты
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

