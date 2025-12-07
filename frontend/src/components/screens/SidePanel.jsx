import { useState } from "react";

export default function SidePanel({ isOpen, onClose, children }) {
  const [meetingTitle, setMeetingTitle] = useState("");

  return (
    <>
      <div
        onClick={onClose}
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
          onClick={onClose}
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
            <button className="bg-[#5d95fd] rounded-xl w-[93px]">
              Schedule
            </button>
            <button
              onClick={onClose}
              className="bg-transparent w-[93px] text-white font-bold py-3 px-6 rounded-xl border-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
