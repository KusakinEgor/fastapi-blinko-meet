export class AudioPlayer {
	constructor() {
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
		this.nextStartTime = 0;
	}

	playChunk(arrayBuffer) {
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume();
		}

		try {
			const int16Data = new Int16Array(arrayBuffer);
			const float32Data = new Float32Array(int16Data.length);

			for (let i = 0; i < int16Data.length; i++) {
				float32Data[i] = int16Data[i] / 32768.0;
			}

			const buffer = this.audioCtx.createBuffer(1, float32Data.length, 16000);
			buffer.getChannelData(0).set(float32Data);

			const currentTime = this.audioCtx.currentTime;

			if (this.nextStartTime < currentTime) {
				this.nextStartTime = currentTime;
			}

			if (this.nextStartTime - currentTime > 1.0) {
				this.nextStartTime = currentTime;
			}

			const source = this.audioCtx.createBufferSource();
			source.buffer = buffer;
			source.connect(this.audioCtx.destination);

			source.start(this.nextStartTime);

			this.nextStartTime += buffer.duration;
		} catch (e) {
			this.errorCount = (this.errorCount || 0) + 1;
			if (this.errorCount % 100 === 0) {
				console.warn("Пропущено 100 битых аудио-пакетов");
			}
		}
	}
}
