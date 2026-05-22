import { useEffect, useRef, useState } from "react";
import { createPeer } from "./peer";
import { createSignaling, sendOffer } from "./signaling";

export function useWebRTC({ localStream, roomId, userId }) {
	const pc = useRef(null);
	const socket = useRef(null);
	const iceQueue = useRef([]);
	const remoteCandidatesQueue = useRef([]); // Очередь для ранних входящих кандидатов
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
				const payload = { type: "candidate", candidate };

				// Проверяем состояние сокета напрямую через ws переменную из замыкания
				if (socket.current?.readyState === WebSocket.OPEN) {
					socket.current.send(JSON.stringify(payload));
				} else {
					console.warn("WS not open, candidate queued");
					iceQueue.current.push(payload); // Сохраняем ОБЪЕКТ, а не строку!
				}
			}
		});

		pc.current = peer;

		const ws = createSignaling({
			roomId,
			userId,

			onMessage: async (data) => {
				if (data.type === "offer") {
					try {
						console.log("Принимаем входящий оффер...");

						await peer.setRemoteDescription(new RTCSessionDescription({
							type: "offer",
							sdp: data.sdp
						}));

						const answer = await peer.createAnswer();
						await peer.setLocalDescription(answer);

						ws.send(JSON.stringify({
							type: "answer",
							sdp: answer.sdp
						}));

						// Сразу после установки remoteDescription накатываем сохраненные ранние кандидаты
						while (remoteCandidatesQueue.current.length > 0) {
							const cand = remoteCandidatesQueue.current.shift();
							await peer.addIceCandidate(new RTCIceCandidate(cand));
						}

					} catch (err) {
						console.error("Ошибка при установке оффера:", err);
					}
				}

				if (data.type === "answer") {
					try {
						console.log("Принимаем входящий ансвер...");
						await peer.setRemoteDescription(new RTCSessionDescription({
							type: "answer",
							sdp: data.sdp
						}));

						// Накатываем ранние кандидаты для создателя оффера
						while (remoteCandidatesQueue.current.length > 0) {
							const cand = remoteCandidatesQueue.current.shift();
							await peer.addIceCandidate(new RTCIceCandidate(cand));
						}
					} catch (err) {
						console.error("Ошибка при установке ансвера:", err);
					}
				}

				if (data.type === "candidate") {
					try {
						// Если описание уже есть — добавляем сразу
						if (peer.remoteDescription && peer.remoteDescription.type) {
							await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
						} else {
							// Если описания еще нет — бережно сохраняем в очередь, а не выкидываем!
							console.log("Кандидат пришел раньше описания, сохраняем в буфер");
							remoteCandidatesQueue.current.push(data.candidate);
						}
					} catch (err) {
						console.error("Ошибка добавления ICE-кандидата:", err);
					}
				}

				if (data.type === "participants_update") {
					window.dispatchEvent(new CustomEvent("webrtc_event", { detail: data }));
				}

				if (data.type === "chat_message") {
					window.dispatchEvent(new CustomEvent("chat_message", { detail: data }));
				}

				if (data.type === "emoji_reaction") {
					window.dispatchEvent(new CustomEvent("emoji_reaction", { detail: data }));
				}
			},

			onOpen: async () => {
				// Отправляем оффер только если мы инициатор (например, первый в комнате). 
				// Если логика бэкенда сама решает, кто шлет оффер, метод sendOffer можно убрать отсюда.
				await sendOffer({ pc: peer, roomId, userId });

				// Отправляем скопившуюся локальную очередь кандидатов
				iceQueue.current.forEach(payload => {
					ws.send(JSON.stringify(payload));
				});
				iceQueue.current = [];
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

