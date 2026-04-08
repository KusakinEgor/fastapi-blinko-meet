import { useState, useRef } from "react";

export const useScreenRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: { frameRate: { ideal: 30 } },
				audio: true
			});

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm; codecs=vp9"
			});

			mediaRecorderRef.current = MediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: "video/webm" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");

				a.href = url;
				a.download = `rec-${Date.now()}.webm`;
				a.click();

				stream.getTracks().forEach(track => track.stop());
			};

			stream.getVideoTracks()[0].onended = () => stopRecording();

			mediaRecorder.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Recording error:", err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	return { isRecording, startRecording, stopRecording };
};
