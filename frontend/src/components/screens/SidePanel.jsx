import { useState } from "react";
import { roomsApi } from "../../api/rooms.js";

export default function SidePanel({ isOpen, onClose, children }) {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSchedule = async () => {
	  if (!meetingTitle.trim()) return;

	  setIsLoading(true);

	  try {
		  const data = await roomsApi.createRoom(meetingTitle);
		  setInviteLink(data.invite_link);
		  setIsScheduled(true);
	  } catch (err) {
		  console.error("Error create room:", err);
		  alert("Не удалось запланировать встречу");
	  } finally {
		  setIsLoading(false);
	  }
  };

  const handleCopy = () => {
	  navigator.clipboard.writeText(inviteLink);
	  setShowToast(true);
	  setTimeout(() => setShowToast(false), 3000);
  };

  const handleClose = () => {
	  onClose();
	  setTimeout(() => {
		  setIsScheduled(false);
		  setMeetingTitle("");
		  setInviteLink("");
	  }, 500);
  };

  return (
    <>
	  <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 transform
		${showToast ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
		<div className="bg-[#242424] text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
			<div className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
			<span className="font-medium text-sm">Ссылка скопирована в буфер</span>
		</div>
	  </div>

      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[60%] flex flex-col p-6
          shadow-xl transition-transform duration-500
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "linear-gradient(to left, #000 0%, #000 95%, transparent 100%)",
        }}
      >
        <button
          onClick={handleClose}
          className="self-end text-white text-2xl font-bold hover:text-gray-400 transition-colors duration-200"
        >
          &times;
        </button>

        <div
          className={`mt-6 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}

		  {!isScheduled ? (
			  <>
				  <div className="relative mb-6">
					<input
					  type="text"
					  id="meetingTitle"
					  value={meetingTitle}
					  onChange={(e) => setMeetingTitle(e.target.value)}
					  className="peer w-[600px] h-15 px-4 pt-5 pb-2 rounded-xl bg-[#171717] text-white placeholder-transparent outline-none"
					  placeholder="Meeting title"
					/>
					<label
					  htmlFor="meetingTitle"
					  className="absolute left-4 top-2 text-[#999999] font-bold text-sm transition-all duration-200
								 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
								 peer-focus:top-2 peer-focus:text-sm"
					>
					  Meeting title
					</label>
				  </div>

				  <div className="flex gap-4">
					<button onClick={handleSchedule} disabled={isLoading} className="bg-[#5d95fd] rounded-xl w-[93px] font-bold text-white">
						{isLoading ? "Wait..." : "Schedule"}
					</button>
					<button
					  onClick={handleClose}
					  className="bg-transparent w-[93px] text-white font-bold py-3 px-6 rounded-xl border-none"
					>
					  Cancel
					</button>
				  </div>
			  </>
		  ) : (
			  <div className="w-[600px] animate-in fade-in duration-500">
				<h2 className="text-white text-2xl font-bold mb-2">Видеовстреча запланирована</h2>
				<p className="text-[#999999] mb-8 text-sm">
					Отправьте ссылку участникам встречи и подключайтесь в любое время
				</p>
				
				<div className="relative mb-4">
					<div className="w-full bg-[#171717] p-4 rounded-xl flex justify-between items-center border border-white/5">
						<div className="overflow-hidden">
							<span className="text-[#999999] text-xs block mb-1">Адрес видеовстречи</span>
							<p className="text-white truncate text-sm">{inviteLink}</p>
						</div>
						<button onClick={handleCopy} className="ml-4 text-[#999999] hover:text-white transition-colors">
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
						</button>
					</div>
				</div>
				
				<button onClick={handleCopy} className="w-full bg-[#242424] text-white font-bold py-4 rounded-xl hover:bg-[#323232] transition-colors">
					Скопировать приглашение
				</button>
			  </div>
		  )}
        </div>
      </div>
    </>
  );
}
