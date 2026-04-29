import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
	useEffect(() => {
		const timer = setTimeout(onClose, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-500">
			<div className={`px-6 py-3 rounded-2xl border backdrop-blur-xl flex items-center gap-3 shadow-2xl ${
				type === "error"
					? "bg-red-500/10 border-red-500/20 text-red-400"
					: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
			}`}>
				<div className={`w-2 h-2 rounded-full animate-pulse ${
					type === "error" ? "bg-red-500" : "bg-emerald-500"
				}`}/>
				<span className="text-[11px] font-black uppercase tracking-[0.2em]">{message}</span>
			</div>
		</div>
	);
};

export default Toast;
