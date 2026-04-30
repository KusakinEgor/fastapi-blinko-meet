export class AudioSocket {
	constructor(roomId, onDataReceived) {
		this.roomId = roomId;
		this.socket = null;
		this.onDataReceived = onDataReceived;
	}

	connect() {
		const url = `ws://localhost:8000/media/ws/audio/${this.roomId}`;

		this.socket = new WebSocket(url);
		this.socket.binaryType = "arraybuffer";

		this.socket.onmessage = (event) => {
			if (this.onDataReceived) {
				this.onDataReceived(event.data);
			}
		};

		this.socket.onopen = () => console.log("Audio Socket Connected");
		this.socket.onerror = (err) => console.error("Audio Socket Error:", err);
		this.socket.close = () => console.log("Audio Socket Closed");
	}

	sendAudio(data) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(data);
		}
	}

	close() {
		if (this.socket) {
			this.socket.close();
		}
	}
}
