import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import Button from "../ui/Button";
import CreateRoomScreen from "./CreateRoomScreen";
import MyIcon from "../../assets/card.svg"
import DivButton from "../ui/DivButton";
import LoginScreen from "./LoginScreen";
import SidePanel from "./SidePanel";
import JoinScreen from "./JoinScreen";
import LoginPanel from "./LoginPanel";

export default function LandingScreen({onJoin, onCreate, onLogin}) {
  const [loaded, setLoaded] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const { i18n, t } = useTranslation();
  const isRussian = i18n.language?.startsWith("ru");

  const toggleLanguage = () => {
	  const newLang = isRussian ? "en" : "ru";
	  i18n.changeLanguage(newLang);
  };

  useEffect(() => setLoaded(true), []);

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">

      <div
        className={`sm:w-24 bg-[#080808] backdrop-blur-xl flex flex-col justify-between items-center p-4 transition-all duration-1000
        ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
      >
        <div className="flex flex-col gap-6 mt-4">

          <Button
            variant="secondary"
            className="flex flex-col items-center py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200"
            onClick={() => setShowLoginPanel(!showLoginPanel)}
          >
            <svg
              width="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-xl mb-1"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5497 19.7485C10.25 19.1602 10.25 18.3901 10.25 16.85V12.75H14.9393L13.2197 14.4697C12.9268 14.7626 12.9268 15.2374 13.2197 15.5303C13.5126 15.8232 13.9874 15.8232 14.2803 15.5303L17.2803 12.5303C17.5732 12.2374 17.5732 11.7626 17.2803 11.4697L14.2803 8.46968C13.9874 8.17678 13.5126 8.17678 13.2197 8.46968C12.9268 8.76257 12.9268 9.23744 13.2197 9.53034L14.9393 11.25H10.25V7.15C10.25 5.60986 10.25 4.83978 10.5497 4.25153C10.8134 3.73408 11.2341 3.31338 11.7515 3.04973C12.3398 2.75 13.1099 2.75 14.65 2.75H16.35C17.8901 2.75 18.6602 2.75 19.2485 3.04973C19.7659 3.31338 20.1866 3.73408 20.4503 4.25153C20.75 4.83978 20.75 5.60986 20.75 7.15V16.85C20.75 18.3901 20.75 19.1602 20.4503 19.7485C20.1866 20.2659 19.7659 20.6866 19.2485 20.9503C18.6602 21.25 17.8901 21.25 16.35 21.25H14.65C13.1099 21.25 12.3398 21.25 11.7515 20.9503C11.2341 20.6866 10.8134 20.2659 10.5497 19.7485ZM10.25 11.25H6.25C5.83579 11.25 5.5 11.5858 5.5 12C5.5 12.4142 5.83579 12.75 6.25 12.75H10.25V11.25Z"
                fill="currentColor"
              ></path>
            </svg>
            Login
          </Button>

          <Button
            variant="secondary"
            onClick={onCreate}
            className="flex flex-col items-center py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-xl mb-1"
            >
              <path
                d="M4.09999 18H13.55C14.7097 18 15.6499 17.1046 15.6499 16V8C15.6499 6.89543 14.7097 6 13.55 6H4.09999C2.9402 6 2 6.89543 2 8V16C2 17.1046 2.9402 18 4.09999 18Z"
                fill="currentColor"
                fillOpacity="0.96"
              ></path>
              <path
                d="M23 15.5862V8.4146C23 7.86231 22.5299 7.4146 21.95 7.4146C21.6715 7.4146 21.4044 7.51996 21.2075 7.70749L17.4425 11.2933C17.0324 11.6838 17.0324 12.317 17.4425 12.7075L21.2075 16.2933C21.6176 16.6838 22.2824 16.6838 22.6924 16.2933C22.8893 16.1057 23 15.8514 23 15.5862Z"
                fill="currentColor"
                fillOpacity="0.96"
              ></path>
            </svg>
            Meetings
          </Button>

        </div>

        <div className="flex flex-col items-center gap-2 mb-4">
          <p className="text-white font-semibold text-center">BLINKO MEET</p>

          <Button
            variant="secondary"
            className="py-1 px-3 text-sm hover:bg-white/20 rounded-lg"
			onClick={toggleLanguage}
          >
			{isRussian ? "EN" : "RU"}
          </Button>

          <p className="text-gray-400 text-xs mt-1">v25.0.1</p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-10 p-10 w-full h-screen justify-center items-center">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-end">
                    <DivButton
                        onClick={onCreate}
                        className="bg-blue-500 w-[320px] h-[568px] rounded-xl flex flex-col justify-between p-4 overflow-hidden cursor-pointer relative"
                    >
                        <svg width="120" height="97" viewBox="0 0 120 97" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M78.2756 46.5515L99.457 68.9399C99.6955 69.192 99.9044 69.2771 100.08 69.312C100.289 69.3537 100.554 69.3392 100.825 69.2355C101.097 69.1317 101.285 68.9731 101.391 68.8298C101.476 68.7164 101.561 68.5496 101.564 68.2341L102 27.4133C102.003 27.1125 101.926 26.9453 101.845 26.828C101.746 26.6831 101.569 26.5233 101.313 26.412C101.058 26.3009 100.801 26.2726 100.59 26.3026C100.41 26.3283 100.197 26.4027 99.9499 26.63L95.8896 22.2125C100.519 17.9572 108.066 21.2383 108 27.4774L107.564 68.2981C107.495 74.704 99.5311 77.7487 95.0985 73.0634L80.178 57.2927V70.7125C80.178 75.9384 75.88 80.1748 70.578 80.1748H21.6C16.2981 80.1748 12 75.9384 12 70.7125V25.6371C12 20.4112 16.2981 16.1748 21.6 16.1748H70.578C75.88 16.1748 80.178 20.4112 80.178 25.6371V36.6535L95.8896 22.2125L99.9499 26.63L78.2756 46.5515ZM74.1781 25.6371C74.1781 23.8064 72.6483 22.1748 70.578 22.1748H21.6C19.5298 22.1748 18 23.8064 18 25.6371V70.7125C18 72.5432 19.5298 74.1748 21.6 74.1748H70.578C72.6483 74.1748 74.1781 72.5432 74.1781 70.7125V25.6371Z" fill="white" fill-opacity="0.96"></path>
                        </svg>
                        <span className="text-white mt-2 text-[56px] leading-[58px] font-bold">{t("home.create_meeting")}</span>
                        <div className="absolute inset-0 bg-white/1 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </DivButton>
                </div>

                <div className="flex flex-col gap-4 h-[568]">
                    <div onClick={() => setSidePanelOpen(true)} className="bg-[#171717] flex flex-col flex-1 rounded-xl p-4 overflow-hidden cursor-pointer relative">
                        <svg width="65" height="65" viewBox="0 0 65 65" fill="none">
                            <path d="M30.1667 15.0317C28.9314 15.0317 27.9299 16.1153 27.9299 17.4519V34.086C27.929 34.1558 27.9308 34.2254 27.9354 34.2946C27.982 35.0178 28.3222 35.6534 28.8279 36.0628C28.9106 36.1298 28.9977 36.1907 29.0887 36.2449L38.2884 42.1357C39.3582 42.804 40.7263 42.4074 41.3439 41.2498C41.9616 40.0923 41.595 38.6122 40.5252 37.9439L32.4035 32.7265V17.4519C32.4035 16.1153 31.4021 15.0317 30.1667 15.0317Z" fill="#FCC24D"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M32.4989 55.0318C45.1225 55.0318 55.356 44.7983 55.356 32.1747C55.356 19.551 45.1225 9.31752 32.4989 9.31752C19.8752 9.31752 9.64174 19.551 9.64174 32.1747C9.64174 44.7983 19.8752 55.0318 32.4989 55.0318ZM32.4989 59.6032C47.6473 59.6032 59.9275 47.323 59.9275 32.1747C59.9275 17.0263 47.6473 4.74609 32.4989 4.74609C17.3505 4.74609 5.07031 17.0263 5.07031 32.1747C5.07031 47.323 17.3505 59.6032 32.4989 59.6032Z" fill="#FCC24D"></path>
                        </svg>

                        <div className="mt-auto">
                            <span className="text-white font-bold mt-2 text-[32px] leading-[36px]">{t("home.schedule_title")}</span>
                            <br></br>
                            <span className="text-[#999999] font-semibold mt-1 text-[18px]">{t("home.schedule_desc")}</span>    
                        </div>

                        <div className="absolute inset-0 bg-white/1 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>

                    <DivButton
                        onClick={onJoin}
                        className="bg-[#171717] flex flex-col flex-1 rounded-xl p-4 overflow-hidden cursor-pointer relative" 
                    >
                        <svg width="65" height="65" viewBox="0 0 65 65" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0003 34.7227L44.0641 34.7227L31.1793 47.2185C30.1496 48.2171 30.1496 49.8559 31.1793 50.8545C32.2091 51.8532 33.8725 51.8532 34.9022 50.8545L52.3019 33.9802C53.3317 32.9815 53.3317 31.3684 52.3019 30.3697L34.9022 13.4954C33.8725 12.4967 32.2091 12.4967 31.1793 13.4954C30.1496 14.494 30.1496 16.1072 31.1793 17.1058L44.0641 29.6015L10.0003 29.6015C8.54807 29.6015 7.35993 30.7538 7.35993 32.1621C7.35993 33.5705 8.54807 34.7227 10.0003 34.7227Z" fill="#BF6BF2"></path>
                        </svg>

                        <div className="mt-auto">
                            <span className="text-white font-bold mt-2 text-[32px] leading-[36px]">{t("home.join_meeting")}</span>
                        </div>

                        <div className="absolute inset-0 bg-white/1 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </DivButton>
                </div>
            </div>
            
            <div className="flex flex-col justify-center items-start gap-4">
                <div>
                    <span className="text-white font-semibold text-[70px]">{t("home.login_title")}</span>
                    <span className="text-[#999999] font-semibold text-[70px] leading-[70px]"><Trans i18nKey="home.login_description">to manage your<br/>meetings and see it's<br/>history</Trans></span>
                </div>
                <DivButton
                    onClick={onLogin}
                    className="bg-[#fff] py-2 px-4 rounded-xl mt-10 w-[220px] h-[48px] flex justify-center items-center"
                >
                    <span className="text-black font-semibold">{t("home.sign_in_btn")}</span>
                </DivButton> 
                <div>
                    <img src={MyIcon} alt="icon"></img>
                </div>
            </div>
      </div>
      <LoginPanel visible={showLoginPanel} onClose={() => setShowLoginPanel(false)} />
      <SidePanel isOpen={sidePanelOpen} onClose={() => setSidePanelOpen(false)}>
        <h2 className="text-white text-[40px] font-bold mb-4">Schedule a meeting</h2>
      </SidePanel>

    </div>
  );
}
