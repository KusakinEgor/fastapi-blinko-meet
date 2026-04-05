import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser({
        username: "Ivan_Zolo",
        email: "ivan_zolo2006@gmail.com",
        status: "PRO",
        likes: 1337,
        avatar: null,
        dateOfBirth: ""
      });
    }
  }, []);

  const [trophies] = useState([
    { id: 1, name: "Первопроходец", icon: "💎", desc: "Вы с нами с самого запуска" },
    { id: 2, name: "Спикер", icon: "🎙️", desc: "Провел более 10 конференций" },
    { id: 3, name: "Актив", icon: "🔥", desc: "Заходил 7 дней подряд" },
    { id: 4, name: "Детектив", icon: "🔍", desc: "Нашел баг в системе" },
  ]);

  const [history] = useState([
    { id: 1, name: "Project Sync", date: "24 Oct, 14:20", duration: "45 min" },
    { id: 2, name: "Design Review", date: "22 Oct, 10:00", duration: "1h 12 min" },
    { id: 3, name: "Weekly Standup", date: "20 Oct, 09:15", duration: "20 min" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="h-[100dvh] bg-[#050505] text-white flex flex-col items-center font-sans selection:bg-[#3f81fd]/30 overflow-hidden">
      <div className="w-full max-w-2xl h-full flex flex-col p-6 overflow-y-auto scrollbar-hide">
        
        <div className="flex justify-between items-center mb-8 shrink-0">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Главная</span>
          </button>

          <button 
            onClick={() => navigate("/profile/edit")}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 hover:text-white transition cursor-pointer"
          >
            Редактировать
          </button>
        </div>

        <header className="flex flex-col items-center gap-4 mb-10 shrink-0">
          <div className="relative">
            {user.avatarPreview ? (
              <img
                src={user.avatarPreview}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-3xl">
                {user.username.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-[#050505] rounded-full"></div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
            </div>

            <p className="text-zinc-500 text-sm mt-1 font-medium">{user.email}</p>

            {user.dateOfBirth && (
              <p className="text-xs text-zinc-600 mt-1">
                {user.dateOfBirth}
              </p>
            )}
          </div>
        </header>

        <main className="space-y-8 flex-1">
          <section>
            <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 px-1">Достижения</h3>
            <div className="grid grid-cols-4 sm:flex gap-3">
              {trophies.map((badge) => (
                <div key={badge.id} className="group relative aspect-square sm:w-12 sm:h-12 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-center hover:border-[#3f81fd]/50 transition-all cursor-help">
                  <span className="text-xl group-hover:scale-110 transition-transform">{badge.icon}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-1">События</p>
              <p className="text-xl font-bold">12</p>
            </div>

            <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Симпатии</p>
              <p className="text-xl font-bold text-[#3f81fd]">{user.likes}</p>
            </div>
          </section>

          <section>
            <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 px-1">История</h3>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-zinc-900/20 p-3 rounded-xl border border-white/5">
                  <p className="text-sm">{item.name}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-auto pt-8 pb-4 flex flex-col items-center shrink-0">
          <button
            onClick={handleLogout}
            className="text-zinc-700 hover:text-red-500/80 text-[10px] font-bold uppercase tracking-[0.4em] transition-all"
          >
            Завершить сессию
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserProfile;
