export default function CreateRoomScreen({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-6">Создать новую комнату</h2>

      <button className="w-full max-w-sm py-3 bg-green-600 rounded-xl hover:bg-green-700">
        Создать
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
