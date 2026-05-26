export function createPeer({ localStream, onTrack, onIceCandidate }) {
	const pc = new RTCPeerConnection({
		iceServers: [
			{ urls: "stun:stun.l.google.com:19302" },
			{
				urls: "turn:77.110.125.7:3478?transport=udp",
				username: "coolserver",
				credential: "niceserver"
			}
		],
		iceTransportPolicy: 'all',
		bundlePolicy: 'max-bundle'
	});

	if (localStream) {
		localStream.getTracks().forEach(track => {
			console.log("Добавляем локальный трек в PC:", track.kind);
			const sender = pc.addTrack(track, localStream);

			if (track.kind === "video") {
				setTimeout(async () => {
					try {
						const parameters = sender.getParameters();

						if (!parameters.encodings || parameters.encodings.length === 0) {
							parameters.encodings = [{}];
						}

						parameters.encodings[0].maxBitrate = 500 * 1024;
						parameters.encodings[0].maxFramerate = 20;
						parameters.encodings[0].scaleResolutionDownBy = 1.5;

						parameters.degradationPreference = "maintain-framerate";

						await sender.setParameters(parameters);
						console.log("[Оптимизация WebRTC]: Параметры видео успешно применены для мобильной сети!");
					} catch (err) {
						console.error("Ошибка применения оптимизации WebRTC:", err);
					}
				}, 100);
			}
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

