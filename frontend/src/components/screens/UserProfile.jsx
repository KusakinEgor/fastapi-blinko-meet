import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user] = useState({
    username: "Ivan_Zolo",
    email: "ivan_zolo2006@gmail.com",
    status: "PRO",
    likes: 1337
  });

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
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Профиль</div>
        </div>

        <header className="flex flex-col items-center gap-4 mb-10 shrink-0">
          <div className="relative">
            <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center text-3xl font-medium shadow-2xl ring-1 ring-white/10">
              {user.username.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-[#050505] rounded-full"></div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#3f81fd] font-black uppercase text-white">
                {user.status}
              </span>
            </div>
            <p className="text-zinc-500 text-sm mt-1 font-medium">{user.email}</p>
          </div>
        </header>

        <main className="space-y-8 flex-1">
          <section>
            <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 px-1">Достижения</h3>
            <div className="grid grid-cols-4 sm:flex gap-3">
              {trophies.map((badge) => (
                <div key={badge.id} className="group relative aspect-square sm:w-12 sm:h-12 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-center hover:border-[#3f81fd]/50 transition-all cursor-help">
                  <span className="text-xl group-hover:scale-110 transition-transform">{badge.icon}</span>
                  <div className="absolute bottom-full mb-3 hidden group-hover:block w-40 bg-zinc-900 border border-white/10 text-[10px] p-3 rounded-xl z-20 shadow-2xl pointer-events-none">
                    <p className="text-[#3f81fd] mb-1 font-bold uppercase tracking-widest">{badge.name}</p>
                    <p className="text-zinc-400 leading-snug">{badge.desc}</p>
                  </div>
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-xs tracking-tight">{item.name}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase">{item.duration}</p>
                    </div>
                  </div>
                  <time className="text-zinc-600 text-[10px] font-medium">{item.date}</time>
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

