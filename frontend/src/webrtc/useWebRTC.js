import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling } from "./signaling";

export function useWebRTC({ localStream, roomId, userId }) {
	const peers = useRef(new Map());
	const socket = useRef(null);
	const iceQueue = useRef([]);
	const [remoteStreams, setRemoteStreams] = useState([]); 

	const localStreamRef = useRef(null);
	useEffect(() => {
		localStreamRef.current = localStream;
	}, [localStream]);

	const initPeerConnection = (targetId, wsInstance) => {
		if (peers.current.has(targetId)) {
			return peers.current.get(targetId);
		}

		if (!localStreamRef.current) {
			console.error("❌ Ошибка: localStream еще не захвачен камерой!");
			return null;
		}

		const pc = createPeer({
			localStream: localStreamRef.current,
			onTrack: (stream) => {
				console.log(`📥 Записываем стрим от ${targetId}:`, stream.id);
				setRemoteStreams(prev => {
					if (prev.find(item => item.userId === targetId)) return prev;
					return [...prev, { userId: targetId, stream }];
				});
			},
			onIceCandidate: (candidate) => {
				const activeWs = wsInstance || socket.current;
				if (activeWs && activeWs.readyState === WebSocket.OPEN) {
					activeWs.send(JSON.stringify({
						type: "candidate",
						target_id: targetId,
						payload: candidate
					}));
				}
			}
		});

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

				if (sender_id === userId) return;

				const isPolite = userId < sender_id; 

				if (type === "user_joined") {
					console.log(`👋 Юзер ${sender_id} зашел в комнату.`);

					if (peers.current.has(sender_id)) {
						console.log(`🧹 Сбрасываем старое соединение для ${sender_id}`);
						peers.current.get(sender_id).close();
						peers.current.delete(sender_id);
						setRemoteStreams(prev => prev.filter(item => item.userId !== sender_id));
					}

					const pc = initPeerConnection(sender_id, ws);
					if (!pc) return;

					if (!isPolite) {
						try {
							console.log(`📡 Создаем и отправляем Offer для ${sender_id}...`);
							const offer = await pc.createOffer();
							await pc.setLocalDescription(offer);
							ws.send(JSON.stringify({ type: "offer", target_id: sender_id, payload: offer }));
						} catch (err) {
							console.error("Ошибка создания Offer:", err);
						}
					}
				}

				if (type === "offer") {
					console.log(`📥 Получен Offer от ${sender_id}`);
					
					if (peers.current.has(sender_id)) {
						peers.current.get(sender_id).close();
						peers.current.delete(sender_id);
						setRemoteStreams(prev => prev.filter(item => item.userId !== sender_id));
					}

					const pc = initPeerConnection(sender_id, ws);
					if (!pc) return;

					try {
						await pc.setRemoteDescription(new RTCSessionDescription(payload));
						const answer = await pc.createAnswer();
						await pc.setLocalDescription(answer);

						console.log(`📡 Отправляем Answer для ${sender_id}...`);
						ws.send(JSON.stringify({ type: "answer", target_id: sender_id, payload: answer }));
					} catch (err) {
						console.error("Ошибка обработки Offer:", err);
					}
				}

				if (type === "answer") {
					console.log(`📥 Получен Answer от ${sender_id}`);
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
					console.log(`❌ Юзер ${sender_id} покинул комнату.`);
					const pc = peers.current.get(sender_id);
					if (pc) {
						pc.close();
						peers.current.delete(sender_id);
					}
					setRemoteStreams(prev => prev.filter(item => item.userId !== sender_id));
				}

				// Системные события
				if (type === "participants_update") window.dispatchEvent(new CustomEvent("webrtc_event", { detail: data }));
				if (type === "chat_message") window.dispatchEvent(new CustomEvent("chat_message", { detail: data }));
				if (type === "emoji_reaction") window.dispatchEvent(new CustomEvent("emoji_reaction", { detail: data }));
			},
			onOpen: () => {
				console.log("🟢 Сигнальный канал готов.");
				iceQueue.current.forEach(msg => ws.send(msg));
				iceQueue.current = [];
			}
		});

		socket.current = ws;

		return () => {
			console.log("🧹 Полный сброс WebRTC");
			peers.current.forEach(pc => pc.close());
			peers.current.clear();
			setRemoteStreams([]);
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
	};

	return {
		remoteStreams,
		sendMessage
	};
}

