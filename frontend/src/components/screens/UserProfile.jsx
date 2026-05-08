import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile, getAvatarUrl, getUserHistory, likeProfile, inviteToCall } from "../../api/user.js";
import UserSearch from "./UserSearch.jsx";
import Toast from "../ui/Toast.jsx";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const showToast = (message, type = "success") => {
	  setToast({ message, type });
  };

  useEffect(() => {
	  const loadAllData = async () => {
		  try {
			  const profileData = await getProfile(id);

			  if (!profileData) {
				  throw new Error("No profile data received");
			  }

			  let historyData = [];

			  if (!id) {
				  historyData = await getUserHistory();
			  }

			  setUser({
				  username: profileData.display_name || "New User",
				  email: profileData.email || "hidden",
				  status: profileData.status || "USER",
				  likes: profileData.likes || 0,
				  avatarPreview: getAvatarUrl(profileData.avatar_url),
				  dateOfBirth: profileData.date_of_birth || "—"
			  });

			  setUserBadges(profileData.badges || []);
			  setHistory(historyData);
		 } catch (err) {
			 console.error("Profile load failed:", err);

			 if (err.status === 401) {
				 navigate("/login");
			 } else if (!id) {
				 const stored = localStorage.getItem("user");
				 if (stored) setUser(JSON.parse(stored));
			 }
		 }
	  };

	  loadAllData();
  }, [id, navigate]);

  const handleLike = async () => {
	  try {
		  const data = await likeProfile(id);
		  setUser(prev => ({ ...prev, likes: data.likes }));
		  showToast("Profile Liked!");
	  } catch (err) {
		  if (err.message.includes("403")) {
			  showToast("Wait an hour to like again", "error");
		  } else {
			  console.error("Like error:", err);
		  }
	  }
  };

  const handleInvite = async () => {
	  try {
		  await inviteToCall(user.username);
		  showToast("Link copied to clipboard");
	  } catch (err) {
		  showToast("Failed to copy link", "error");
	  }
  };

  const handleHistoryClick = (meeting) => {
	  if (meeting) {
		  navigate(`/summary/${meeting.slug}`);
	  } else {
		  showToast("Summary not available", "error");
	  }
  }

  const [trophies] = useState([
    { id: 1, name: "Pioneer", icon: "💎", color: "from-blue-400 to-cyan-500" },
    { id: 2, name: "Speaker", icon: "🎙️", color: "from-purple-400 to-pink-500" },
    { id: 3, name: "Active", icon: "🔥", color: "from-orange-400 to-red-500" },
    { id: 4, name: "Detective", icon: "🔍", color: "from-green-400 to-emerald-500" },
  ]);

  if (!user) return null;

  return (
    <div className="h-[100dvh] bg-[#050505] text-white flex flex-col items-center font-sans selection:bg-[#3f81fd]/30 overflow-hidden relative">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3f81fd]/20 blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl h-full flex flex-col px-8 z-10 overflow-hidden">
        
        <nav className="h-20 flex justify-between items-center shrink-0">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all duration-300"
          >
            <div className="p-2.5 rounded-full bg-zinc-900/30 border border-white/5 group-hover:bg-zinc-800/50 group-hover:scale-110 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">Back</span>
          </button>
		  
	      <button 
		    onClick={() => setIsSearchOpen(true)}
			className="p-2.5 rounded-full bg-zinc-900/30 border border-white/5 hover:scale-110 transition-all ml-auto mr-4"
		  >
		    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
	        </svg>
		  </button>
			
		  {!id && (
			  <button 
				onClick={() => navigate("/profile/edit")}
				className="px-6 py-2.5 bg-gradient-to-tr from-zinc-800 to-zinc-900 hover:from-white hover:to-white hover:text-black rounded-full text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500 border border-white/5 shadow-xl"
			  >
				Settings
			  </button>
		  )}
        </nav>
		
		{isSearchOpen && <UserSearch onClose={() => setIsSearchOpen(false)} />}

        <header className="flex flex-col items-center py-8 shrink-0">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#3f81fd]/40 blur-[40px] rounded-full animate-pulse" />
            <div className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl">
              <div className="w-full h-full rounded-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                {user.avatarPreview ? (
                  <img src={user.avatarPreview} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <span className="text-5xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                    {user.username.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-emerald-500 border-[5px] border-[#050505] rounded-full shadow-lg shadow-emerald-500/20" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              {user.username}
            </h1>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                <span className="text-[#3f81fd] text-[9px] font-black tracking-[0.2em] uppercase">
                  {user.status}
                </span>
                <div className="w-[1px] h-3 bg-white/10" />
                <span className="text-zinc-400 text-xs font-bold">{user.email}</span>
              </div>
              
              {user.dateOfBirth && (
                <div className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-black tracking-widest uppercase">{user.dateOfBirth}</span>
                </div>
              )}
            </div>
			
			{id && (
				<div className="flex justify-center gap-4 mt-8 animate-in slide-in-from-bottom-4 duration-500">
					<button
						onClick={handleLike}
						className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 hover:bg-red-500/10 border border-white/5 hover:border-red-500/40 rounded-2xl transition-all duration-500 group"
					>
						<div className="relative">
							<div className="absolute inset-0 bg-red-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
							
							<svg
								className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 transform"
								fill="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://w3.org"
							>
								<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.71 0 3.144.757 4.312 1.838C13.174 3.757 14.608 3 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
							</svg>
						</div>
						
						<span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
							{user.likes} Likes
						</span>
					</button>
					
					<button
						onClick={handleInvite}
						className="flex items-center gap-3 px-6 py-3 bg-[#3f81fd] hover:bg-[#3f81fd]/80 shadow-[0_0_20px_rgba(63,129,253,0.2)] hover:shadow-[0_0_25px_rgba(63,129,253,0.4)] rounded-2xl transition-all duration-500 group"
					>
						<svg className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Invite to Call</span>
					</button>
				</div>
			)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-12 pb-10">
          
          <section>
            <div className="flex items-center gap-4 mb-6 px-1">
              <h3 className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.4em]">Badges</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {trophies.map((badge) => {
				  const isUnlocked = userBadges.some(ub => ub.name === badge.name);

				  return (
					  <div key={badge.id} className="group flex flex-col items-center gap-2">
						<div
							className={`w-full aspect-square border rounded-[22px] flex items-center justify-center transition-all duration-500 cursor-pointer shadow-lg overflow-hidden relative ${isUnlocked
							? `bg-gradient-to-br ${badge.color} border-white/20 hover:-translate-y-2`
							: 'bg-zinc-900/40 border-white/5 opacity-20 grayscale'}`}
						>
							{isUnlocked && (
								<div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
							)}
							
							<span className={`text-3xl filter drop-shadow-md transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-125' : ''}`}>
								{badge.icon}
							</span>

							{!isUnlocked && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/20">
									<span className="text-[10px]">🔒</span>
								</div>
							)}
						</div>
						<span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isUnlocked} ? 'text-zinc-400' : 'text-zinc-800'`}>
							{badge.name}
						</span>
					  </div>
				  );
			  })}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-5">
            <div className="relative group overflow-hidden bg-zinc-900/20 p-7 rounded-[32px] border border-white/5 hover:border-white/10 transition-all">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all" />
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Events</p>
              <p className="text-4xl font-black tracking-tighter">12</p>
            </div>
            <div className="relative group overflow-hidden bg-zinc-900/20 p-7 rounded-[32px] border border-white/5 border-l-[#3f81fd]/30 hover:border-[#3f81fd]/50 transition-all">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#3f81fd]/5 blur-2xl group-hover:bg-[#3f81fd]/10 transition-all" />
              <p className="text-[#3f81fd] text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-80">Likes</p>
              <p className="text-4xl font-black tracking-tighter text-[#3f81fd] drop-shadow-[0_0_15px_rgba(63,129,253,0.3)]">
                {user.likes}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 px-1">
              <h3 className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.4em]">Activity</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="space-y-4">
              {history.length > 0 ? (
					history.map((item) => (
						<div key={item.id} onClick={() => handleHistoryClick(item)} className="group relative bg-zinc-900/10 hover:bg-zinc-900/40 p-6 rounded-[24px] border border-white/5 hover:border-white/10 transition-all duration-300">
						  <div className="flex items-center justify-between">
							<div className="flex items-center gap-5">
							  <div className="w-10 h-10 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-white/5 group-hover:border-[#3f81fd]/30 group-hover:text-[#3f81fd] transition-all">
								 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								 </svg>
							  </div>
							  <div>
								<p className="text-[16px] font-black tracking-tight group-hover:text-white transition-colors">{item.name || "Untitled Meeting"}</p>
								<p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
									{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
								</p>
							  </div>
							</div>
							<div className="text-right">
							  <span className="text-[10px] font-black bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full border border-white/5 group-hover:bg-[#3f81fd] group-hover:text-white transition-all">
								{item.is_alive ? "Live" : "View"}
							  </span>
							</div>
						  </div>
						</div>
					))
			  ) : (
				  <div className="text-center py-10 border border-dashed border-white/5 rounded-[24px]">
					<p className="text-zinc-600 text-xs uppercase tracking-widest">No meetings yet</p>
				  </div>
			  )}
            </div>
          </section>
        </main>

        <footer className="h-24 flex flex-col items-center justify-center shrink-0 border-t border-white/5">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/");
            }}
            className="group flex flex-col items-center gap-1"
          >
            <span className="text-zinc-700 group-hover:text-red-500 text-[9px] font-black uppercase tracking-[0.5em] transition-all">
              Terminate Session
            </span>
            <div className="w-0 h-[1px] bg-red-500/50 group-hover:w-full transition-all duration-500" />
          </button>
        </footer>
      </div>
	  {toast && (
		  <Toast
			message={toast.message}
			type={toast.type}
			onClose={() => setToast(null)}
		  />
	  )}
    </div>
  );
};

export default UserProfile;

