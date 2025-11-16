export default function PreCallScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center justify-center">

      <h2 className="text-3xl font-semibold mb-6">Проверка камеры и микрофона</h2>

      <div className="w-64 h-48 bg-gray-800 rounded-xl mb-6 flex items-center justify-center text-gray-500">
        Камера превью
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <select className="bg-gray-900 p-3 rounded-xl border border-gray-700">
          <option>Выбрать камеру</option>
        </select>

        <select className="bg-gray-900 p-3 rounded-xl border border-gray-700">
          <option>Выбрать микрофон</option>
        </select>

        <button 
          onClick={onStart}
          className="py-3 bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Начать конференцию
        </button>
      </div>
    </div>
  );
}
