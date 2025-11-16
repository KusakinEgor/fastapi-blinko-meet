export default function LandingScreen({ onJoin, onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Видеоконференции</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Создавай комнаты, присоединяйся, общайся и используй дополнительные инструменты.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button 
          onClick={onJoin}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
        >
          Войти в комнату
        </button>

        <button 
          onClick={onCreate}
          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl transition"
        >
          Создать комнату
        </button>
      </div>
    </div>
  );
}
