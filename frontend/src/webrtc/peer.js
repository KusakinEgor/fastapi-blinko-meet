export function createPeer({ localStream, onTrack, onIceCandidate }) {
	const pc = new RTCPeerConnection({
		iceServers: [
			{ urls: "stun:stun.l.google.com:19302" },
			{
				urls: "turn:77.110.125.7:3478:?transport=udp",
				username: "coolserver",
				credential: "niceserver"
			}
		],
		iceTransportPolicy: 'all',
		bundlePolicy: 'max-bundle'
	});

	if (localStream) {
		localStream.getTracks().forEach(track => {
			console.log("➕ Добавляем локальный трек в PC:", track.kind);
			pc.addTrack(track, localStream);
		});
	}

	pc.ontrack = (event) => {
		console.log("📥 ПОЛУЧЕН УДАЛЕННЫЙ ТРЕК ОТ ПИРА:", event.streams[0]?.id);
		if (event.streams && event.streams[0]) {
			onTrack(event.streams[0]);
		}
	};

	pc.onicecandidate = (event) => {
		if (event.candidate) {
			onIceCandidate(event.candidate);
		}
	};

	pc.oniceconnectionstatechange = () => console.log("🟢 ICE STATE:", pc.iceConnectionState);
	pc.onconnectionstatechange = () => console.log("🟢 PC STATE:", pc.connectionState);

	return pc;
}

