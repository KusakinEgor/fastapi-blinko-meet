import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling } from "./signaling";

export function useWebRTC({
	localStream,
	roomId,
	userId
}) {
	const peers = useRef(new Map());
	const socket = useRef(null);

	const localStreamRef = useRef(null);

	const [remoteStreams, setRemoteStreams] =
		useState([]);

	useEffect(() => {
		localStreamRef.current = localStream;
	}, [localStream]);

	const initPeerConnection = (targetId, wsInstance) => {
		if (peers.current.has(targetId)) {
			return peers.current.get(targetId);
		}

		if (!localStreamRef.current) {
			console.error("localStream еще не готов в рефе!");
			return null;
		}

		const pc = createPeer({
			localStream: localStreamRef.current,

			onTrack: (stream) => {
				console.log("REMOTE STREAM:", stream.id);

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
				const activeWs = wsInstance || socket.current;
				if (
					activeWs &&
					activeWs.readyState === WebSocket.OPEN
				) {
					activeWs.send(
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
		if (!roomId || !userId) return;

		const ws = createSignaling({
			roomId,
			userId,

			onMessage: async (data) => {
				const {
					type,
					sender_id,
					payload
				} = data;

				console.log("SIGNAL:", type, "FROM:", sender_id);

				if (sender_id === userId) {
					return;
				}

				if (type === "client_ready") {
					console.log(`🚀 Юзер ${sender_id} готов принимать звонок.`);

					if (peers.current.has(sender_id)) {
						console.log(`🧹 Сбрасываем старый пир для ${sender_id}`);
						const oldPc = peers.current.get(sender_id);
						oldPc.close();
						peers.current.delete(sender_id);
						setRemoteStreams(prev => prev.filter(item => item.userId !== sender_id));
					}

					const pc = initPeerConnection(sender_id, ws);
					if (!pc) return;

					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);

					ws.send(
						JSON.stringify({
							type: "offer",
							target_id: sender_id,
							payload: offer
						})
					);
				}

				if (type === "offer") {
					console.log(`OFFER FROM ${sender_id}`);

					if (peers.current.has(sender_id)) {
						console.log(`🧹 Сбрасываем старый пир перед новым оффером от ${sender_id}`);
						const oldPc = peers.current.get(sender_id);
						oldPc.close();
						peers.current.delete(sender_id);
						setRemoteStreams(prev => prev.filter(item => item.userId !== sender_id));
					}

					const pc = initPeerConnection(sender_id, ws);
					if (!pc) return;

					await pc.setRemoteDescription(
						new RTCSessionDescription(payload)
					);

					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);

					ws.send(
						JSON.stringify({
							type: "answer",
							target_id: sender_id,
							payload: answer
						})
					);
				}

				if (type === "answer") {
					console.log(`ANSWER FROM ${sender_id}`);
					const pc = peers.current.get(sender_id);
					if (!pc) return;

					await pc.setRemoteDescription(
						new RTCSessionDescription(payload)
					);
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
					console.log(`USER LEFT: ${sender_id}`);
					const pc = peers.current.get(sender_id);
					if (pc) {
						pc.close();
						peers.current.delete(sender_id);
					}

					setRemoteStreams(prev =>
						prev.filter(item => item.userId !== sender_id)
					);
				}
			},

			onOpen: () => {
				console.log("SIGNALING READY. Оповещаем комнату...");
				
				ws.send(
					JSON.stringify({
						type: "client_ready"
					})
				);
			}
		});

		socket.current = ws;

		return () => {
			console.log("CLEANUP WEBRTC");
			peers.current.forEach(pc => {
				pc.close();
			});
			peers.current.clear();
			setRemoteStreams([]);

			if (socket.current) {
				socket.current.onclose = null; 
				socket.current.close();
				socket.current = null;
			}
		};
	}, [roomId, userId]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (socket.current && socket.current.readyState === WebSocket.OPEN) {
				socket.current.send(JSON.stringify({ type: "ping" }));
			}
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	const sendMessage = (messageObj) => {
		if (
			socket.current &&
			socket.current.readyState === WebSocket.OPEN
		) {
			socket.current.send(JSON.stringify(messageObj));
		}
	};

	return {
		remoteStreams,
		sendMessage
	};
}

