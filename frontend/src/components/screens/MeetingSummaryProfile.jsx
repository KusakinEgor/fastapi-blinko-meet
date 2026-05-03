import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import { getMeetingSummary } from "../../api/user";

const MeetingSummaryProfile = () => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const data = await getMeetingSummary(roomId);
				setSummary(data);
			} catch (err) {
				console.error("Failed to load summary", err);
			} finally {
				setLoading(false);
			}
		};
		fetchSummary();
	}, [roomId]);

	if (loading) return (
		<div className="h-screen bg-[#050505] flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#3f81fd]"></div>
		</div>
	);

	return (
		<div className="h-[100dvh] bg-[#050505] text-white flex flex-col items-center font-sans overflow-hidden relative">
			<div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3f81fd]/10 blur-[120px] pointer-events-none" />
			
			<div className="w-full max-w-2xl h-full flex flex-col px-6 z-10 overflow-hidden">
				<nav className="h-20 flex items-center shrink-0">
					<button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all">
						<div className="p-2 rounded-full bg-zinc-900/30 border border-white/5">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
							</svg>
						</div>
						<span className="text-[10px] uppercase tracking-[0.3em] font-black">Back to History</span>
					</button>
				</nav>

				<div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
					<header className="mb-8">
						<div className="inline-block px-3 py-1 rounded-full bg-[#3f81fd]/10 border border-[#3f81fd]/20 text-[#3f81fd] text-[10px] font-black uppercase tracking-widest mb-4">
							AI Generated Summary
						</div>
						<h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
							{summary?.room_name || "Meeting Report"}
						</h1>
						<p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">
							{summary?.created_at ? new Date(summary.created_at).toLocaleString("ru-RU", {
								day: "numeric",
								month: "long",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							}) : "Date unknown"}
						</p>
					</header>

					<div className="relative group">
						<div className="absolute inset-0 bg-gradient-to-b from-[#3f81fd]/5 to-transparent rounded-3xl blur-xl opacity-50" />
						<div className="relative bg-zinc-900/30 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
							<div className="prose prose-invert max-w-none
								prose-h3:text-[#3f81fd] prose-h3:text-xl prose-h3:font-black prose-h3:mb-4 prose-h3:mt-6
								prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
								prose-strong:text-white prose-strong:font-bold
								prose-ul:list-disc prose-ul:pl-5 prose-li:text-zinc-400 prose-li:mb-1">
								
								<ReactMarkdown
									components={{
										h3: ({node, ...props}) => <h3 className="text-[#3f81fd] text-xl font-black mt-8 mb-4 uppercase tracking-wider" {...props} />,
										p: ({node, ...props}) => <p className="text-zinc-400 leading-relaxed mb-4" {...props} />,
										strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
										ul: ({node, ...props}) => <ul className="list-disc pl-5 my-4 space-y-2 text-zinc-400" {...props} />,
										li: ({node, ...props}) => <li className="marker:text-[#3f81fd]" {...props} />,
									}}
								>
									{summary?.summary_text}
								</ReactMarkdown>
							</div>
						</div>
					</div>
					
					<div className="mt-8 grid grid-cols-2 gap-4">
						<div className="p-4 rounded-2xl bg-white/5 border border-white/5">
							<span className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Summary ID</span>
							<span className="text-zinc-300 font-mono text-xs">#{summary?.id}</span>
						</div>
						<div className="p-4 rounded-2xl bg-white/5 border border-white/5">
							<span className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Database Ref</span>
							<span className="text-zinc-300 font-mono text-xs">ROOM_{summary?.room_id}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MeetingSummaryProfile;
