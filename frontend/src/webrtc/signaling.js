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
	console.log("TRACKS BEFORE OFFER:", pc.getSenders().map(s => s.track?.kind));

	if (pc.getSenders === 0) {
		console.error("NO TRACKS");
		return;
	}

	const offer = await pc.createOffer();
	await pc.setLocalDescription(offer);

	console.log("SDP OFFER:");
	console.log(pc.localDescription.sdp);

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

	console.log(
		pc.remoteDescription.sdp.includes("m=video")
			? "remote has video"
			: "remote no video"
	);
}
