import React from 'react';

const CopyIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
	</svg>
);

const InviteModal = ({ isOpen, onClose, meetingData }) => {
	if (!isOpen) return null;

	const handleCopy = (text) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="bg-[#242424] w-full max-w-[400px] rounded-2xl p-6 text-[#E1E1E1] shadow-2xl border border-[#333333] mx-4">
				<div className="flex justify-between items-start">
					<h2 className="text-xl font-bold">Invite participants</h2>
					<button onClick={onClose} className="text-[#999999] hover:text-white transition-colors">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<p className="text-sm text-[#999999] mt-1 mb-6">Maximum number - 100 participants</p>
				
				<div className="space-y-3">
					<div className="bg-[#333333] p-3 rounded-xl border border-[#444444]">
						<label className="block text-[10px] uppercase text-[#999999] mb-1 font-bold">Video meeting URL</label>
						<div className="flex justify-between items-center gap-2">
							<span className="truncate text-sm opacity-90">{meetingData.url}</span>
							<button onClick={() => handleCopy(meetingData.url)} className="text-[#999999] hover:text-white shrink-0">
								<CopyIcon />
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-5">
						<div className="bg-[#333333] p-3 rounded-xl border border-[#444444]">
							<label className="block text-[10px] uppercase text-[#999999] mb-1 font-bold">Meeting code</label>
							<div className="flex justify-between items-center gap-2">
								<span className="text-sm truncate opacity-90">{meetingData.code}</span>
								<button onClick={() => handleCopy(meetingData.code)} className="text-[#999999] hover:text-white shrink-0">
									<CopyIcon />
								</button>
							</div>
						</div>
						<div className="bg-[#333333] p-3 rounded-xl border border-[#444444]">
							<label className="block text-[10px] uppercase text-[#999999] mb-1 font-bold">Password</label>
							<div className="flex justify-between items-center gap-2">
								<span className="text-sm font-mono opacity-90">{meetingData.password}</span>
								<button onClick={() => handleCopy(meetingData.password)} className="text-white shrink-0">
									<CopyIcon />
								</button>
							</div>
						</div>
					</div>
				</div>
				
				<button
					onClick={() => handleCopy(`URL: ${meetingData.url}\nCode: ${meetingData.code}\nPass: ${meetingData.password}`)}
					className="w-full mt-8 bg-[#3d3d3d] hover:bg-[#4d4d4d] py-3.5 rounded-xl transition-all active:scale-[0.98]"
				>
					Copy invitation
				</button>
			</div>
		</div>
	);
};

export default InviteModal;
