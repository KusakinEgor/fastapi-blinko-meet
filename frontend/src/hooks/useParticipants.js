import { useState, useEffect } from "react";

export function useParticipants(slug, userId) {
	const [participants, setParticipants] = useState([]);

	const fetchParticipants = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:3000/rooms/${slug}/participants`);
			const data = await response.json();

			setParticipants(data);
		} catch (err) {
			console.error("Failed to fetch participants:", err);
		}
	};

	useEffect(() => {
		if (slug) fetchParticipants();
	}, [slug]);

	useEffect(() => {
		const handleUpdate = (e) => {
			const data = e.detail;

			if (data.type === "participants_update") {
				setParticipants(data.users);
			}
		};

		window.addEventListener("webrtc_event", handleUpdate);
		return () => window.removeEventListener("webrtc_event", handleUpdate);
	}, []);

	return {
		participants,
		count: participants.length,
		isUserInRoom: (id) => participants.some(p => p.user_id === id)
	};
}
