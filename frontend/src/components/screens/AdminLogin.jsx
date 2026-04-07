import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

const AdminAuth = ({ children }) => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [error, setError] = useState(false);

	const ADMIN_PASSWORD = "root";

	const handleLogin = (e) => {
		e.preventDefault();
		
		if (password === ADMIN_PASSWORD) {
			setIsAuthenticated(true);
			setError(false);
		} else {
			setError(true);
			setPassword("");
		}
	};

	if (isAuthenticated) {
		return children;
	}

	return (
		<div className="h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center font-sans p-6">
			<div className="w-full max-w-sm flex flex-col items-center">
				<div className="w-16 h-16 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
					<svg className={`w-6 h-6 ${error ? 'text-red-500 animate-pulse' : 'text-[#3f81fd]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				
				<h2 className="text-sm uppercase tracking-[0.4em] font-black mb-2">Админ-доступ</h2>
				<p className="text-zinc-600 text-[10px] uppercase tracking-[0.1em] mb-10">Введите ключ доступа для управления</p>
				
				<form onSubmit={handleLogin} className="w-full space-y-4">
					<div className="relative">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							autoFocus
							className={`w-full bg-zinc-900/40 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-4 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-[#3f81fd]/50 transition-all`}
						/>
					</div>
					
					<button
						type="submit"
						className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3f81fd] hover:text-white transition-all active:scale-[0.98]"
					>
						Подтвердить
					</button>
				</form>

				<button
					onClick={() => navigate("/")}
					className="mt-12 text-zinc-600 hover:text-white text-[9px] uppercase tracking-widest transition"
				>
					Вернуться назад
				</button>
			</div>
		</div>
	);
};

export default AdminAuth;
