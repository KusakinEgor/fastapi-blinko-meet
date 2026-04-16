import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function SummaryScreen({ roomSlug, onClose }) {
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		let timer;
		let attempts = 0;
		const maxAttempts = 5;

		const fetchSummary = async () => {
			try {
				const token = localStorage.getItem("access_token");

				const response = await fetch(`http://localhost:8000/ai/summary/${roomSlug}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				});

				if (response.ok) {
					const data = await response.json();
					setSummary(data);
					setLoading(false);
				} else if (response.status === 404 && attempts < maxAttempts) {
					attempts++;
					timer = setTimeout(fetchSummary, 2000);
				} else {
					setLoading(false);
				}
			} catch (err) {
				console.error("Failed to fetch summary", err);
				setLoading(false);
			}
		};

		fetchSummary();

		return () => clearTimeout(timer);
	}, [roomSlug]);

	const handleGoHome = () => {
		if (onClose) onClose();
		navigate("/");
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
			<div className="bg-[#080808] w-full max-w-3xl h-[80vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden relative">
				<div className="p-8 pb-4 flex justify-between items-start">
					<div>
						<p className="text-blue-500 font-mono text-sm uppercase tracking-widest mb-2">AI Analysis</p>
						<h2 className="text-white text-[56px] leading-[58px] font-bold">
							{t("summary.title", "Summary")}
						</h2>
					</div>
					<button
						onClick={handleGoHome}
						className="bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
					{loading ? (
						<div className="h-full flex items-center justify-center">
							<div className="flex flex-col items-center gap-4">
								<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
								<p className="text-gray-400 animate-pulse">GigaChat is thinking...</p>
							</div>
						</div>
					) : summary ? (
						<div className="py-6">
							<div className="bg-white/5 rounded-2xl p-6 border border-white/5 shadow-2xl">
								<div className="text-gray-200 text-xl font-light leading-relaxed prose prose-invert max-w-none">
									<ReactMarkdown
										components={{
											p: ({children}) => <p className="mb-5 last:mb-0">{children}</p>,
											strong: ({ children }) => <strong className="text-blue-400 font-bold">{children}</strong>,
											ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>,
											li: ({ children }) => <li className="pl-2">{children}</li>,
										}}
									>
										{summary.summary_text}
									</ReactMarkdown>
								</div>
							</div>
							
							<div className="mt-8 flex items-center gap-4 text-gray-500 text-sm border-t border-white/5 pt-6">
								<div className="flex flex-col">
									<span>Room Slug</span>
									<span className="text-white font-mono">{roomSlug}</span>
								</div>
								<div className="ml-auto flex flex-col text-right">
									<span>Generated at</span>
									<span className="text-white">{new Date(summary.created_at).toLocaleString()}</span>
								</div>
							</div>
						</div>
					) : (
						<div className="h-full flex flex-col items-center justify-center text-center">
							<div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
								<p className="text-red-500 text-xl font-semibold">No summary found</p>
								<p className="text-gray-500 mt-2">Try to generate it after the meeting</p>
							</div>
						</div>
					)}
				</div>
				
				<div className="p-8 bg-gradient-to-t from-black to-transparent">
					<Button
						onClick={handleGoHome}
						className="w-full py-6 bg-white text-black font-bold text-xl rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
					>
						{t("common.back_to_lobby", "Back to Lobby")}
					</Button>
				</div>
			</div>
		</div>
	);
}
