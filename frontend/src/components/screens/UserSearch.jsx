import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl, searchUser } from "../../api/user.js";

const UserSearch = ({ onClose }) => {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	useEffect(() => {
		const delayDebounceFn = setTimeout(async () => {
			if (query.length > 2) {
				setIsSearching(true);

				try {
					const data = await searchUser(query);

					const mappedData = data.map(u => ({
						id: u.user_id,
						username: u.display_name || "Unknown",
						status: "FREE",
						avatar_url: u.avatar_url
					}));

					setResults(mappedData);
				} catch (err) {
					console.error("Search error:", err);
					setResults([]);
				} finally {
					setIsSearching(false);
				}
			} else {
				setResults([]);
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [query]);

	return (
		<div className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-xl flex flex-col items-center animate-in fade-in duration-300">
			<button
				onClick={onClose}
				className="absolute top-8 right-8 p-3 rounded-full bg-zinc-900 border border-white/10 text-zinc-500 hover:text-white transition-all"
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div className="w-full max-w-xl px-8 pt-24">
				<div className="relative group mb-12">
					<div className="absolute inset-0 bg-[#3f81fd]/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
					<input 
						autoFocus
						type="text"
						placeholder="SEARCH PROFILES"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="relative w-full bg-zinc-900/50 border-b-2 border-white/10 focus:border-[#3f81fd] outline-none py-6 px-4 text-2xl font-black tracking-tighter placeholder:text-zinc-800 transition-all uppercase"
					/>
					{isSearching && (
						<div className="absolute right-4 top-1/2 -translate-y-1/2">
							<div className="w-5 h-5 border-2 border-[#3f81fd] border-t-transparent rounded-full animate-spin" />
						</div>
					)}
				</div>

				<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
					{results.length > 0 ? (
						results.map((item) => (
							<div key={item.id}
							onClick={() => {
								navigate(`/profile/${item.id}`);
								onClose();
							}}
							className="group flex items-center justify-between p-4 rounded-[24px] bg-zinc-900/30 border border-white/5 hover:border-white/20 hover:bg-zinc-800/40 transition-all cursor-pointer">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
										{item.avatar_url ? (
											<img src={getAvatarUrl(item.avatar_url)} className="w-full h-full object-cover" />
										) : (
											<span className="text-sm font-black text-zinc-500">{item.username[0]}</span>
										)}
									</div>
									<div>
										<h4 className="font-black text-sm tracking-tight group-hover:text-[#3f81fd] transition-colors uppercase">{item.username}</h4>
										<span className="text-[9px] font-black text-[#3f81fd] tracking-widest">{item.status}</span>
									</div>
								</div>
								<div className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						))
					) : query.length > 2 ? (
						<p className="text-center text-zinc-600 font-black text-[10px] uppercase tracking-widest pt-10">No users found</p>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default UserSearch;
