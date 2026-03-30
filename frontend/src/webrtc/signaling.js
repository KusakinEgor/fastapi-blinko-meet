export function createSignaling({ roomId, userId, onMessage, onOpen }) {
	const ws = new WebSocket(`ws://127.0.0.1:3000/ws/${roomId}/${userId}`);

	ws.onmessage = async (e) => {
		const data = JSON.parse(e.data);
		onMessage(data);
	};

	ws.onopen = () => {
		onOpen();
	};

	return ws;
}

export async function sendOffer({ pc, roomId, userId }) {
	const offer = await pc.createOffer();
	await pc.setLocalDescription(offer);

	const res = await fetch("http://127.0.0.1:3000/offer", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			sdp: offer.sdp,
			room_id: roomId,
			user_id: userId
		})
	});

	const answer = await res.json()

	await pc.setRemoteDescription({
		type: "answer",
		sdp: answer.sdp
	});
}
