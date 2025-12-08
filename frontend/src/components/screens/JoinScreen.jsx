import { useState, useEffect } from "react";
import Sidebar from "../ui/SideBar";

export default function JoinScreen({ onBack, onJoin }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);

  const [name, setName] = useState("");
  const [meetingCode, setMeetingCode] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [micMuted, setMicMuted] = useState(false);
  const [camMuted, setCamMuted] = useState(false);

  return (
    <div className="min-h-screen flex bg-black text-white relative overflow-hidden">
      <Sidebar loaded={loaded} onLogin={onBack} onCreate={onBack} />

      <div className="flex flex-col w-full p-10 gap-6">

        <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white font-semibold text-lg">Back</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 flex-1">
          <div className="flex flex-col relative items-center justify-center bg-[#1c1c1c] p-8 rounded-2xl shadow-xl flex-1">
            <div className="bg-[#4e4e4e] w-[40px], h-[30px] rounded-full flex absolute top-2 right-2">
                <svg width="30px" height="30px" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.99 9.894c.45.207 1.585.886 1.73.977.175.11.282.303.28.51v1.238a.598.598 0 01-.288.515c-.19.12-1.298.781-1.73.977l-.558 1.35c.18.476.502 1.75.54 1.916a.598.598 0 01-.162.558l-.875.874a.602.602 0 01-.558.162l-.022-.005c-.27-.07-1.46-.374-1.893-.535l-1.35.558c-.207.45-.885 1.586-.977 1.73a.603.603 0 01-.51.281h-1.236a.598.598 0 01-.515-.288c-.12-.19-.781-1.298-.977-1.73l-1.35-.558c-.476.18-1.75.502-1.916.54a.598.598 0 01-.558-.162l-.874-.875a.601.601 0 01-.162-.558l.005-.022c.07-.27.374-1.46.535-1.893l-.558-1.35c-.45-.207-1.586-.885-1.73-.977a.603.603 0 01-.281-.51v-1.236c0-.208.109-.401.286-.51.191-.12 1.298-.78 1.73-.977l.558-1.35c-.18-.475-.502-1.75-.54-1.915a.598.598 0 01.162-.558l.875-.88a.601.601 0 01.558-.162l.023.005c.27.07 1.46.374 1.892.535l1.35-.558c.207-.45.886-1.586.977-1.73a.603.603 0 01.51-.281h1.238c.208 0 .401.109.51.286.12.191.78 1.298.977 1.73l1.35.558c.475-.18 1.75-.502 1.915-.54a.598.598 0 01.558.162l.88.875a.601.601 0 01.162.558l-.005.022c-.07.271-.374 1.46-.535 1.893l.558 1.35zM8.08 11.993a3.922 3.922 0 107.845.007 3.922 3.922 0 00-7.845-.007z" fill="currentColor"></path>
                </svg>
            </div>
            <div className="text-center text-3xl font-bold mb-2">Allow</div>
            <div className="text-center text-gray-400">
              Please allow access to your camera to continue
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 flex-1 max-w-md w-full">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-300">Your Name</label>
              <input
                className="w-full h-14 px-4 rounded-xl bg-[#171717] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-300">Meeting Code</label>
              <input
                className="w-full h-14 px-4 rounded-xl bg-[#171717] text-white"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                placeholder="Enter meeting code"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-300">Meeting Password</label>
              <input
                className="w-full h-14 px-4 rounded-xl bg-[#171717] text-white"
                value={meetingPassword}
                onChange={(e) => setMeetingPassword(e.target.value)}
                placeholder="Enter meeting password"
              />
            </div>

            <div
              onClick={() => onJoin({ name, meetingCode, meetingPassword })}
              className="bg-[#3f81fd] py-3 rounded-lg text-center text-lg font-semibold cursor-pointer mt-4 max-w-md mx-auto"
            >
              Join the Meeting
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <button
            className={`px-6 py-3 rounded-xl font-semibold ${micMuted ? 'bg-red-600' : 'bg-blue-600'}`}
            onClick={() => setMicMuted(!micMuted)}
          >
            {micMuted ? "Unmute Mic" : "Mute Mic"}
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold ${camMuted ? 'bg-red-600' : 'bg-blue-600'}`}
            onClick={() => setCamMuted(!camMuted)}
          >
            {camMuted ? "Unmute Cam" : "Mute Cam"}
          </button>
        </div>
      </div>
    </div>
  );
}
