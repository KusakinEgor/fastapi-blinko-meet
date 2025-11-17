export default function VideoTile({ children }) {
  return (
    <div className="
      bg-white/5 border border-white/10 backdrop-blur-lg
      rounded-xl flex items-center justify-center text-gray-400
    ">
      {children}
    </div>
  );
}
