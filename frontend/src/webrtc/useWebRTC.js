import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling, sendOffer } from "./signaling";

export function useWebRTC({ localStream, roomId, userId }) {
	const pc = useRef(null);
	const socket = useRef(null);
	const iceQueue = useRef([]);
	const [remoteStreams, setRemoteStreams] = useState([]); 

	useEffect(() => {
		if (!localStream) return;

		const peer = createPeer({
			localStream,

			onTrack: (stream) => {
				console.log("GOT REMOTE STREAM", stream.id);

				setRemoteStreams(prev => {
					if (prev.find(s => s.id === stream.id)) return prev;
					return [...prev, stream];
				});
			},

			onIceCandidate: (candidate) => {
				const message = JSON.stringify({ type: "candidate", candidate });

				if (socket.current?.readyState === WebSocket.OPEN) {
					socket.current.send(message);
				} else {
					console.warn("WS not open, candidate skipped");
					iceQueue.current.push(message);
				}
			}
		});

		pc.current = peer;

		const ws = createSignaling({
			roomId,
			userId,

			onMessage: async (data) => {
				if (data.type === "offer") {
					await peer.setRemoteDescription({
						type: "offer",
						sdp: data.sdp
					});

					const answer = await peer.createAnswer();
					await peer.setLocalDescription(answer);

					ws.send(JSON.stringify({
						type: "answer",
						sdp: answer.sdp
					}));
				}

				if (data.type === "candidate") {
					await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
				}

				if (data.type === "participants_update") {
					console.log("Participants updated:", data.users);
					window.dispatchEvent(new CustomEvent("webrtc_event", { detail: data }));
				}

				if (data.type === "chat_message") {
					setRemoteStreams(prev => prev);
					window.dispatchEvent(new CustomEvent("chat_message", { detail: data }));
				}
			},

			onOpen: async () => {
				iceQueue.current.forEach(msg => ws.send(msg));
				iceQueue.current = [];

				await sendOffer({ pc: peer, roomId, userId });
			}
		});

		socket.current = ws;

		return () => {
			peer.close();
			ws.close();
		};
	}, [localStream, roomId, userId]);

	return {
		remoteStreams,
		ws: socket.current
	};
}
