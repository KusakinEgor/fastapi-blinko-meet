import { useState, useEffect } from "react";
import Sidebar from "../ui/SideBar";
import MeetRoom from "./MeetRoom";

export default function CreateRoomScreen({ onBack, onJoin }) {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("join");

  useEffect(() => setLoaded(true), []);

  const [name, setName] = useState("");
  const [meetingCode, setMeetingCode] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [micMuted, setMicMuted] = useState(true);
  const [camMuted, setCamMuted] = useState(true);

  if (screen === "meet") {
    return (
      <MeetRoom
        name={name}
        meetingTitle={meetingPassword}
        onBack={() => setScreen("create")}
      />
    );
  } 

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
            <div className="bg-[#4e4e4e] w-[40px] h-[30px] rounded-full flex justify-center items-center absolute top-2 right-2">
              <svg width="30px" height="30px" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.99 9.894c.45.207 1.585.886 1.73.977.175.11.282.303.28.51v1.238a.598.598 0 01-.288.515c-.19.12-1.298.781-1.73.977l-.558 1.35c.18.476.502 1.75.54 1.916a.598.598 0 01-.162.558l-.875.874a.602.602 0 01-.558.162l-.022-.005c-.27-.07-1.46-.374-1.893-.535l-1.35.558c-.207.45-.885 1.586-.977 1.73a.603.603 0 01-.51.281h-1.236a.598.598 0 01-.515-.288c-.12-.19-.781-1.298-.977-1.73l-1.35-.558c-.476.18-1.75.502-1.916.54a.598.598 0 01-.558-.162l-.874-.875a.601.601 0 01-.162-.558l.005-.022c.07-.27.374-1.46.535-1.893l-.558-1.35c-.45-.207-1.586-.885-1.73-.977a.603.603 0 01-.281-.51v-1.236c0-.208.109-.401.286-.51.191-.12 1.298-.78 1.73-.977l.558-1.35c-.18-.475-.502-1.75-.54-1.915a.598.598 0 01.162-.558l.875-.88a.601.601 0 01.558-.162l.023.005c.27.07 1.46.374 1.892.535l1.35-.558c.207-.45.886-1.586.977-1.73a.603.603 0 01.51-.281h1.238c.208 0 .401.109.51.286.12.191.78 1.298.977 1.73l1.35.558c.475-.18 1.75-.502 1.915-.54a.598.598 0 01.558.162l.88.875a.601.601 0 01.162.558l-.005.022c-.07.271-.374 1.46-.535 1.893l.558 1.35zM8.08 11.993a3.922 3.922 0 107.845.007 3.922 3.922 0 00-7.845-.007z"
                  fill="currentColor">
                </path>
              </svg>
            </div>

            <div className="text-[#999999] text-center text-3xl font-bold mb-2">Camera prohibited</div>
            <div className="text-center font-semibold text-[#3f7fdf]">Allow</div>
          </div>

          <div className="flex flex-col justify-center gap-4 flex-1 max-w-md w-full">
            <span className="font-bold text-[40px] leading-none">New video meeting</span>

            <div className="relative w-full">
              <input
                type="text"
                id="meetingCode"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                className="peer w-full h-16 px-4 pt-5 pb-2 rounded-xl bg-[#171717] text-white placeholder-transparent outline-none"
                placeholder="Meeting code"
              />
              <label
                htmlFor="meetingCode"
                className="absolute left-4 top-2 text-[#999999] font-bold text-sm transition-all duration-200
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm"
              >
                Your name
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                id="meetingPassword"
                value={meetingPassword}
                onChange={(e) => setMeetingPassword(e.target.value)}
                className="peer w-full h-16 px-4 pt-5 pb-2 rounded-xl bg-[#171717] text-white placeholder-transparent outline-none"
                placeholder="Meeting password"
              />
              <label
                htmlFor="meetingPassword"
                className="absolute left-4 top-2 text-[#999999] font-bold text-sm transition-all duration-200
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm"
              >
                Meeting title
              </label>
            </div>

            <div
              onClick={() => {
                setScreen("meet");
              }}
              className="bg-[#3f81fd] py-3 rounded-lg text-center text-lg font-semibold cursor-pointer mt-4 max-w-md mx-auto p-2"
            >
              Create and join
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <div 
			className="flex bg-[#262626] w-[72px] h-[40px] rounded-xl justify-center items-center"
			onClick={() => setMicMuted(!micMuted)}
		  >
            <svg width="33px" viewBox="0 0 24 24" fill="none">
				{micMuted ? (
					<>
						<path d="M11.9999 2C10.0669 2 8.49994 3.67893 8.49994 5.75V11.75C8.49994 12.2471 8.59022 12.7216 8.75416 13.1557L7.45127 14.4586C7.08164 13.8449 6.83854 13.157 6.74353 12.4353C6.68946 12.0246 6.31272 11.7356 5.90205 11.7896C5.49138 11.8437 5.2023 12.2204 5.25636 12.6311C5.39487 13.6832 5.77814 14.6793 6.3658 15.5441L2.46967 19.4402C2.17678 19.7331 2.17678 20.208 2.46967 20.5009C2.76256 20.7938 3.23744 20.7938 3.53033 20.5009L7.34482 16.6864C7.34477 16.6864 7.34487 16.6864 7.34482 16.6864L8.40645 15.625C8.4064 15.625 8.40649 15.6251 8.40645 15.625L9.57605 14.4552C9.57601 14.4551 9.57609 14.4552 9.57605 14.4552L20.5009 3.53033C20.7938 3.23744 20.7938 2.76256 20.5009 2.46967C20.208 2.17678 19.7331 2.17678 19.4402 2.46967L15.4999 6.40996V5.75C15.4999 3.67893 13.9329 2 11.9999 2Z" fill="red"></path>
					<path d="M9.67204 16.4808L8.56313 17.5897C9.3702 18.0576 10.2676 18.3542 11.1986 18.4583V20.75C11.1986 21.1642 11.5344 21.5 11.9486 21.5C12.3628 21.5 12.6986 21.1642 12.6986 20.75V18.4583C14.0641 18.3056 15.3572 17.7388 16.3992 16.825C17.6304 15.7452 18.4271 14.2547 18.6409 12.6311C18.6949 12.2204 18.4058 11.8437 17.9952 11.7896C17.5845 11.7356 17.2078 12.0246 17.1537 12.4353C16.9875 13.6981 16.3678 14.8574 15.4102 15.6972C14.4526 16.537 13.2223 17 11.9486 17C11.1543 17 10.3769 16.82 9.67204 16.4808Z" fill="red"></path>
					<path d="M15.4999 10.6529L10.8572 15.2956C11.2153 15.4281 11.5998 15.5 11.9999 15.5C13.9329 15.5 15.4999 13.8211 15.4999 11.75V10.6529Z" fill="red"></path>
					</>
				) : (
					<path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 2C10.0671 2 8.50009 3.67893 8.50009 5.75V11.75C8.50009 13.8211 10.0671 15.5 12.0001 15.5C13.9331 15.5 15.5001 13.8211 15.5001 11.75V5.75C15.5001 3.67893 13.9331 2 12.0001 2ZM6.74367 12.4353C6.6896 12.0246 6.31286 11.7356 5.90219 11.7896C5.49152 11.8437 5.20244 12.2204 5.2565 12.6311C5.47025 14.2547 6.26695 15.7452 7.49817 16.825C8.54017 17.7388 9.83324 18.3056 11.1988 18.4583V20.75C11.1988 21.1642 11.5345 21.5 11.9488 21.5C12.363 21.5 12.6988 21.1642 12.6988 20.75V18.4583C14.0643 18.3056 15.3573 17.7388 16.3993 16.825C17.6306 15.7452 18.4273 14.2547 18.641 12.6311C18.6951 12.2204 18.406 11.8437 17.9953 11.7896C17.5847 11.7356 17.2079 12.0246 17.1538 12.4353C16.9876 13.6981 16.3679 14.8574 15.4103 15.6972C14.4527 16.537 13.2224 17 11.9488 17C10.6751 17 9.4448 16.537 8.48719 15.6972C7.52958 14.8574 6.90992 13.6981 6.74367 12.4353Z" fill="currentColor"></path>
				)}
            </svg>
            <svg width="25px" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.96967 9.9676C7.26256 9.67471 7.73744 9.67471 8.03033 9.9676L12 13.9373L15.9697 9.9676C16.2626 9.67471 16.7374 9.67471 17.0303 9.9676C17.3232 10.2605 17.3232 10.7354 17.0303 11.0283L12 16.0586L6.96967 11.0283C6.67678 10.7354 6.67678 10.2605 6.96967 9.9676Z" fill="currentColor"></path>
            </svg>
          </div>

          <div className="flex bg-[#262626] w-[72px] h-[40px] rounded-xl justify-center items-center" onClick={() => setCamMuted(!camMuted)}>
            <svg width="33px" viewBox="0 0 24 24" fill="none">
				{camMuted ? (
					<>	
					<path d="M19.5297 4.53082C19.8229 4.23819 19.8233 3.76332 19.5307 3.47016C19.238 3.17699 18.7632 3.17656 18.47 3.46918L15.1294 6.80365C14.6153 6.30615 13.9148 6 13.1429 6H4.85714C3.27919 6 2 7.27919 2 8.85714V15.1429C2 16.4344 2.85697 17.5258 4.03331 17.8794L2.47014 19.4397C2.17698 19.7324 2.17655 20.2072 2.46917 20.5004C2.7618 20.7936 3.23667 20.794 3.52983 20.5014L19.5297 4.53082Z" fill="red"></path>
					<path d="M13.1429 18H8.15357L16 10.1536V15.1429C16 16.7208 14.7208 18 13.1429 18Z" fill="red"></path>
					<path d="M22.0003 8.79931C22.0003 7.95084 20.9745 7.52592 20.3745 8.12587L17.1488 11.3515C16.7867 11.7136 16.7758 12.2972 17.1241 12.6726L20.3497 16.1496C20.9386 16.7843 22.0003 16.3676 22.0003 15.5018V8.79931Z" fill="red"></path>
					</>
				) : (
					<>
						<path d="M4.85714 6C3.27919 6 2 7.27919 2 8.85714V15.1429C2 16.7208 3.27919 18 4.85714 18H13.1429C14.7208 18 16 16.7208 16 15.1429V8.85714C16 7.27919 14.7208 6 13.1429 6H4.85714Z" fill="currentColor"></path>
					<path d="M22.0003 8.79931C22.0003 7.95084 20.9745 7.52592 20.3745 8.12587L17.1488 11.3515C16.7867 11.7136 16.7758 12.2972 17.1241 12.6726L20.3497 16.1496C20.9386 16.7843 22.0003 16.3676 22.0003 15.5018V8.79931Z" fill="currentColor"></path>
					</>
				)}
            </svg>
            <svg width="25px" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.96967 9.9676C7.26256 9.67471 7.73744 9.67471 8.03033 9.9676L12 13.9373L15.9697 9.9676C16.2626 9.67471 16.7374 9.67471 17.0303 9.9676C17.3232 10.2605 17.3232 10.7354 17.0303 11.0283L12 16.0586L6.96967 11.0283C6.67678 10.7354 6.67678 10.2605 6.96967 9.9676Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
