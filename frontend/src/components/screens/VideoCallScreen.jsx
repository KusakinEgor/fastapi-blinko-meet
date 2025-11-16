export default function VideoCallScreen() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 flex flex-col">

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800 rounded-xl flex items-center justify-center">
          Видео участника
        </div>
        <div className="bg-gray-800 rounded-xl flex items-center justify-center">
          Видео участника
        </div>
        <div className="bg-gray-800 rounded-xl flex items-center justify-center">
          Видео участника
        </div>
      </div>

      <div className="flex justify-center gap-4 py-4 bg-gray-900 rounded-xl">
        <button className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700">Выйти</button>
        <button className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600">Микрофон</button>
        <button className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600">Камера</button>
      </div>

    </div>
  );
}
