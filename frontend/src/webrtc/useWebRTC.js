import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling } from "./signaling";

export function useWebRTC({ localStream, roomId, userId }) {
	const peers = useRef(new Map());
	const socket = useRef(null);
	const localStreamRef = useState(null);
	const [remoteStreams, setRemoteStreams] = useState([]); 

	useEffect(() => {
		localStreamRef.current = localStream;
	}, [localStream]);

	const initPeerConnection = (targetId) => {
		if (peers.current.has(targetId)) {
			return peers.current.get(targetId);
		}

		const pc = createPeer({
			localStream,
			onTrack: (stream) => {
				setRemoteStreams(prev => {
					const exists = prev.find(
						item => item.userId === targetId
					);

					if (exists) {
						return prev;
					}

					return [
						...prev,
						{
							userId: targetId,
							stream
						}
					];
				});
			},
			onIceCandidate: (candidate) => {
				if (socket.current && socket.current.readyState === WebSocket.OPEN) {
					socket.current.send(
						JSON.stringify({
							type: "candidate",
							target_id: targetId,
							payload: candidate
						})
					);
				}
			}
		});

		peers.current.set(targetId, pc);
		return pc;
	};

	useEffect(() => {
		if (!localStream) return;

		const ws = createSignaling({
			roomId,
			userId,

			onMessage: async (data) => {
				const { type, sender_id, payload } = data;

				console.log("SIGNAL_TYPE:", type, "FROM:", sender_id);

				if (sender_id === userId) {
					return;
				}

				if (type === "user_joined") {
					console.log(`🚀 Новый юзер ${sender_id} зашел. Создаем для него Offer...`);

					const pc = initPeerConnection(sender_id);

					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);

					ws.send(JSON.stringify({
						type: "offer",
						target_id: sender_id,
						payload: offer
					}));
				}

				if (type === "offer") {
					console.log(`📥 Получен Offer от ${sender_id}. Создаем Answer...`);
					const pc = initPeerConnection(sender_id);

					if (pc.signalingState !== "stable") {
						console.warn("PC not stable");
					}

					await pc.setRemoteDescription(new RTCSessionDescription(payload));
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);

					ws.send(JSON.stringify({
						type: "answer",
						target_id: sender_id,
						payload: answer
					}));
				}

				if (type === "answer") {
					console.log(`📥 Получен Answer от ${sender_id}`);
					const pc = peers.current.get(sender_id);

					if (!pc) return;

					await pc.setRemoteDescription(new RTCSessionDescription(payload));
				}

				if (type === "candidate") {
					const pc = peers.current.get(sender_id);

					if (!pc || !payload) return;

					try {
						await pc.addIceCandidate(new RTCIceCandidate(payload));
					} catch (e) {
						console.error("ICE ERROR:", e);
					}
				}

				if (type === "user_left") {
					console.log(`❌ Юзер ${sender_id} покинул комнату. Закрываем Peer Connection.`);
					const pc = peers.current.get(sender_id);
					if (pc) {
						pc.close();
						peers.current.delete(sender_id);
					}
					setRemoteStreams(prev => prev.filter(item => item.userId !== sender_id));
				}

				if (type === "participants_update") {
					window.dispatchEvent(new CustomEvent("webrtc_event", { detail: data }));
				}
				if (type === "chat_message") {
					window.dispatchEvent(new CustomEvent("chat_message", { detail: data }));
				}
				if (type === "emoji_reaction") {
					window.dispatchEvent(new CustomEvent("emoji_reaction", { detail: data }));
				}
			},

			onOpen: () => {
				console.log("Signaling ready");
			}
		});

		socket.current = ws;

		return () => {
			peers.current.forEach(pc => {
				pc.close();
			});

			peers.current.clear();

			if (socket.current) {
				socket.current.close();
				socket.current = null;
			}
		};
	}, [localStream, roomId, userId]);

	const sendMessage = (messageObj) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			socket.current.send(JSON.stringify(messageObj));
		} else {
			console.warn("Не удалось отправить сообщение: сокет закрыт");
		}
	}

	return {
		remoteStreams,
		sendMessage
	};
}

