export function createSignaling({ roomId, userId, onMessage, onOpen }) {
	const baseRustUrl = import.meta.env.VITE_RUST_API_URL;
	const wsProtocol = baseRustUrl.startsWith('https') ? 'wss://' : 'ws://';
	const baseWsUrl = baseRustUrl.replace(/^https?:\/\//, wsProtocol);

	const ws = new WebSocket(`${baseWsUrl}/ws/${roomId}/${userId}`);

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
	const storedUser = JSON.parse(localStorage.getItem("user"));
	const username = storedUser?.username || userId;

	if (pc.getSenders().length === 0) {
		alert("⚠️ Локальный баг: Телефон не смог захватить камеру (NO TRACKS)!");
		return;
	}

	const offer = await pc.createOffer();
	await pc.setLocalDescription(offer);

	console.log("HAS VIDEO MLINE:", pc.localDescription.sdp.includes("m=video"));

	console.log("SDP OFFER:");
	console.log(pc.localDescription.sdp);

	const baseRustUrl = import.meta.env.VITE_RUST_API_URL;

	const res = await fetch(`${baseRustUrl}/offer`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			sdp: offer.sdp,
			room_id: roomId,
			user_id: userId,
			username: username
		})
	});

	const answer = await res.json()

	//const fixedSdp = answer.sdp.replace(/a=recvonly/g, 'a=sendrecv');

	await pc.setRemoteDescription({
		type: "answer",
		sdp: answer.sdp
	});

	console.log(
		pc.remoteDescription.sdp.includes("m=video")
			? "remote has video"
			: "remote no video"
	);

	console.log(pc.getTransceivers().map(t => ({
		kind: t.receiver.track.kind,
		currentDirection: t.currentDirection // Должно быть "sendrecv" или "recvonly"
	})))
}
