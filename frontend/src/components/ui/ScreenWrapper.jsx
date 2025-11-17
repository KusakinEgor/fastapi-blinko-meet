export default function ScreenWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
        {children}
      </div>
    </div>
  );
}
