export default function SettingsModal({ isOpen, onClose }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="bg-[#1c1c1c] w-full max-w-[420px] rounded-[24px] p-6 text-white shadow-2xl border border-white/5 relative">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h2 className="text-2xl font-bold">Settings</h2>
						<span className="text-xs text-gray-500">1.0.0</span>
					</div>
					<button
						onClick={onClose}
						className="p-1 hover:bg-white/10 rounded-lg transition-colors"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
					<div>
						<p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">General</p>
						<div className="space-y-4">
							<div className="bg-[#2b2b2b] p-3 rounded-xl border border-white/5">
								<p className="text-xs text-gray-400 mb-1">Your name</p>
								<input type="text" defaultValue="=Вечерная автоматизация=" className="bg-transparent w-full outline-none text-sm font-medium" />
							</div>

							<div className="bg-[#2b2b2b] p-3 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer">
								<div>
									<p className="text-sm font-medium">English</p>
									<p className="text-[10px] text-gray-400">Interface language</p>
								</div>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="gray"><path d="M7 10l5 5 5-5z" /></svg>
							</div>
						</div>
					</div>
				
					<div>
						<p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Audio and Video</p>
						
						<button 
							className="w-full bg-[#3b3b3b] hover:bg-[#4b4b4b] text-white py-3 rounded-xl flex justify-center items-center gap-2 mb-4 font-semibold text-sm transition-colors border border-white/5"
						>
							<span className="text-red-500 text-lg">cam</span> Grant access to camera
						</button>
						
						<div className="space-y-4">
							<div className="bg-[#2b2b2b] p-3 rounded-xl border border-white/5">
								<div className="flex justify-between items-center">
									<p className="text-sm">As in system: By default</p>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="gray"><path d="M7 10l5 5 5-5z" /></svg>
								</div>
								<p className="text-[10px] text-gray-400 mt-1">Microphone</p>
							</div>
							
							<div className="bg-[#2b2b2b] p-4 rounded-xl border border-white/10 flex justify-between items-center">
								<div className="max-w-[80%]">
									<p className="text-sm font-medium">Join with no mic and cam</p>
									<p className="text-[10px] text-gray-400 leading-tight">Join every meeting with your microphone and camera off</p>
								</div>
								<div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
									<div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full shadow-sm"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
