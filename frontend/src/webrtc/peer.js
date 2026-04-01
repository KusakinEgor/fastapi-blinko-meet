export function createPeer({ localStream, onTrack, onIceCandidate }) {
	const pc = new RTCPeerConnection({
		iceServers: [{
			urls: "stun:stun.l.google.com:19302"
		}],
		iceTransportPolicy: 'all',
		bundlePolicy: 'max-bundle'
	});

	//localStream.getTracks().forEach(track => {
	//	pc.addTrack(track, localStream);
	//});

	//localStream.getVideoTracks().forEach(track => pc.addTrack(track, localStream));
	
	const videoTrack = localStream.getVideoTracks()[0];
	if (videoTrack) {
		pc.addTransceiver(videoTrack, {
            direction: 'sendrecv', 
            streams: [localStream]
        });
	}

	pc.ontrack = (event) => {
		console.log("ON TRACK FIRED");

		const stream = (event.streams && event.streams[0]) || new MediaStream([event.track]);
        onTrack(stream);

		console.log(event.streams);
	};

	pc.onicecandidate = (event) => {
		if (event.candidate) {
			onIceCandidate(event.candidate);
		}
	};

	return pc;
}
