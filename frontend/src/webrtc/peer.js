export function createPeer({ localStream, onTrack, onIceCandidate }) {
	const pc = new RTCPeerConnection({
		iceServers: [{
			urls: "stun:stun.l.google.com:19302"
		}]
	});

	localStream.getTracks().forEach(track => {
		pc.addTrack(track, localStream);
	});

	pc.ontrack = (event) => {
		const stream = event.streams[0];
		onTrack(stream);
	};

	pc.onicecandidate = (event) => {
		if (event.candidate) {
			onIceCandidate(event.candidate);
		}
	};

	return pc;
}
