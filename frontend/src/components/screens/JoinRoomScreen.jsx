import { useState } from "react";

export default function JoinRoomScreen({ onBack }) {
  const [roomId, setRoomId] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-6">Вход в комнату</h2>

      <input
        type="text"
        placeholder="ID комнаты"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full max-w-sm p-3 rounded-xl bg-gray-900 border border-gray-700 mb-4"
      />

      <button className="w-full max-w-sm py-3 bg-blue-600 rounded-xl hover:bg-blue-700">
        Войти
      </button>

      <button
        onClick={onBack}
        className="mt-4 text-gray-400 hover:text-white"
      >
        Назад
      </button>
    </div>
  );
}
