export function createSignaling({ roomId, userId, onMessage, onOpen }) {
	const baseRustUrl = import.meta.env.VITE_RUST_API_URL;
	const wsProtocol = baseRustUrl.startsWith('https') ? 'wss://' : 'ws://';
	const baseWsUrl = baseRustUrl.replace(/^https?:\/\//, wsProtocol);

	const ws = new WebSocket(`${baseWsUrl}/ws/${roomId}/${userId}`);

	ws.onmessage = async (e) => {
		try {
			const data = JSON.parse(e.data);
			onMessage(data);
		} catch (err) {
			console.error("Ошибка парсинга WebSocket сообщения:", err);
		}
	};

	ws.onopen = () => {
		console.log("🔌 Успешное подключение к сигнальному серверу Rust");
		onOpen();
	};

	return ws;
}

