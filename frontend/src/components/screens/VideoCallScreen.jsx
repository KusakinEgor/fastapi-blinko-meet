import Button from "../ui/Button";
import VideoTile from "../ui/VideoTile";

export default function VideoCallScreen() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white p-4 flex flex-col">

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <VideoTile key={i}>Видео участника</VideoTile>
        ))}
      </div>

      <div className="flex justify-center gap-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg shadow-black/40">
        <Button variant="danger">Выйти</Button>
        <Button variant="secondary">Микрофон</Button>
        <Button variant="secondary">Камера</Button>
      </div>

    </div>
  );
}
