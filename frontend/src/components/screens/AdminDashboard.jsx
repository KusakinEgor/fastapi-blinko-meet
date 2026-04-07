import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [stats, setStats] = useState({ total_users: 0, pro_users: 0, total_likes: 0 });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [search, setSearch] = useState("");

	const API_URL = "http://localhost:8000/admin";
	const token = localStorage.getItem("access_token");

	const fetchData = async () => {
		try {
			const headers = { "Authorization": `Bearer ${token}` };

			const [usersRes, statsRes] = await Promise.all([
				fetch(`${API_URL}/users`, { headers }),
				fetch(`${API_URL}/stats`, { headers })
			]);

			if (usersRes.ok && statsRes.ok) {
				setUsers(await usersRes.json());
				setStats(await statsRes.json());
			}
		} catch (err) {
			console.error("Error download:", err);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const deleteUser = async (id) => {
		if (!window.confirm("Удалить пользователя?")) return;

		try {
			const res = await fetch(`${API_URL}/users/${id}`, {
				method: "DELETE",
				headers: { "Authorization": `Bearer ${token}` }
			});
			if (res.ok) fetchData();
		} catch (err) {
			console.error(err);
		}
	};

	const saveUser = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);

		const userData = {
			username: formData.get("username"),
			email: formData.get("email"),
			status: formData.get("status"),
			likes: parseInt(formData.get("likes") || 0),
			password: formData.get("password") || null
		};

		try {
			const isEdit = !!currentUser;
			const url = isEdit ? `${API_URL}/users/${currentUser.id}` : `${API_URL}/users`;
			const method = isEdit ? "PATCH" : "POST";

			const res = await fetch(url, {
				method: method,
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(userData)
			});

			if (res.ok) {
				setIsModalOpen(false);
				setCurrentUser(null);
				fetchData();
			} else {
				const errData = await res.json();
				alert(`Ошибка: ${errData.detail || "Действие не удалось"}`);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const filteredUsers = users.filter(u =>
		u.username.toLowerCase().includes(search.toLowerCase()) ||
		u.email.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="h-[100dvh] bg-[#050505] text-white flex flex-col items-center font-sans selection:bg-[#3f81fd]/30 overflow-hidden">
			<div className="w-full max-w-4xl h-full flex flex-col p-6 overflow-y-auto scrollbar-hide">
				<div className="flex justify-between items-center mb-10 shrink-0">
					<button
						onClick={() => navigate("/")}
						className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all"
					>
						<svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
						</svg>
						<span className="text-[10px] uppercase tracking-[0.2em] font-bold">Выход</span>
					</button>

					<h1 className="text-xs uppercase tracking-[0.5em] font-black text-zinc-400">Control Panel</h1>
					
					<button
						onClick={() => { setCurrentUser(null); setIsModalOpen(true); }}
						className="bg-white text-black px-4 py-2 rounded-lg text-[10px] uppercase tracking-[0.1em] font-bold hover:bg-[#3f81fd] hover:text-white transition"
					>
						+ Новый юзер
					</button>
				</div>
				
				<section className="grid grid-cols-3 gap-4 mb-10 shrink-0">
					{[
						{ label: "Всего", val: users.length },
						{ label: "PRO Аккаунты", val: users.filter(u => u.status === 'PRO').length },
						{ label: "Total Likes", val: users.reduce((acc, u) => acc + u.likes, 0) }
					].map((stat, i) => (
						<div key={i} className="bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
							<p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
							<p className="text-2xl font-bold font-mono">{stat.val}</p>
						</div>
					))}
				</section>
				
				<div className="mb-6">
					<input
						type="text"
						placeholder="Поиск по системе..."
						className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3f81fd]/50 transition"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				
				<main className="flex-1">
					<h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 px-1">Пользователи</h3>
					<div className="space-y-3">
						{filteredUsers.map((u) => (
							<div key={u.id} className="group flex items-center justify-between bg-zinc-900/20 hover:bg-zinc-900/40 p-4 rounded-2xl border border-white/5 transition-all">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-[#3f81fd]">
										{u.username[0]}
									</div>
									<div>
										<p className="text-sm font-bold tracking-tight">{u.username}</p>
										<p className="text-[11px] text-zinc-500">{u.email}</p>
									</div>
								</div>
								
								<div className="flex items-center gap-6">
									<div className="hidden sm:block text-right">
										<span className={`text-[9px] font-bold px-2 py-1 rounded border ${u.status === 'PRO' ? 'border-amber-500/50 text-amber-500' : 'border-zinc-700 text-zinc-500'}`}>
											{u.status}
										</span>
									</div>

									<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											onClick={() => { setCurrentUser(u); setIsModalOpen(true); }}
											className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" /></svg>
										</button>
										<button
											onClick={() => deleteUser(u.id)}
											className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-500 transition"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" /></svg>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</main>
				
				<aside className="hidden lg:block w-80 border-l border-white/5 pl-6 ml-6">
					<h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Системный лог</h3>
					<div className="space-y-4 font-mono text-[10px]">
						{[
							{ time: '12:44', msg: 'DB connection stable', type: 'success' },
							{ time: '12:40', msg: 'New user registered: alex_v', type: 'info' },
							{ time: '12:32', msg: 'Failed login attempt: root', type: 'error' },
						].map((log, i) => (
							<div key={i} className="flex gap-3 text-zinc-500">
								<span className="text-zinc-700">{log.time}</span>
								<span className={log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-500' : 'text-zinc-300'}>
									{log.msg}
								</span>
							</div>
						))}
					</div>
				</aside>
			</div>
			
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
					<div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl">
						<h2 className="text-xl font-bold mb-6">{currentUser ? 'Редактировать' : 'Новый пользователь'}</h2>
						<form onSubmit={saveUser} className="space-y-4">
							<div className="space-y-1">
								<label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Username</label>
								<input name="username" defaultValue={currentUser?.username} required className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#3f81fd] outline-none" />
							</div>
							<div className="space-y-1">
								<label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Email</label>
								<input name="email" type="email" defaultValue={currentUser?.email} required className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#3f81fd] outline-none" />
							</div>
							<div className="space-y-1">
								<label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">
									{currentUser ? "Новый пароль (необязательно)" : "Пароль"}
								</label>
								<input
									name="password"
									type="password"
									placeholder="••••••••"
									required={!currentUser}
									className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#3f81fd] outline-none"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Статус</label>
									<select name="status" defaultValue={currentUser?.status || "FREE"} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none">
										<option value="FREE">FREE</option>
										<option value="PRO">PRO</option>
										<option value="ADMIN">ADMIN</option>
									</select>
								</div>
								<div className="space-y-1">
									<label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Лайки</label>
									<input name="likes" type="number" defaultValue={currentUser?.likes || 0} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none" />
								</div>
							</div>

							<div className="flex gap-3 mt-8">
								<button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl text-zinc-500 font-bold text-xs uppercase hover:bg-white/5 transition">Отмена</button>
								<button type="submit" className="flex-1 bg-[#3f81fd] px-4 py-3 rounded-xl text-white font-bold text-xs uppercase hover:bg-[#3f81fd]/80 transition">Сохранить</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminDashboard;
