import Button from "./Button";

export default function Sidebar({ loaded, onLogin, onCreate }) {
  return (
    <div
      className={`sm:w-24 bg-white/10 backdrop-blur-xl flex flex-col justify-between items-center p-4 transition-all duration-1000
      ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
    >
      <div className="flex flex-col gap-6 mt-4">
        <Button
            variant="secondary"
            className="flex flex-col items-center py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200"
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
            onClick={() => setScreen("createRoom")}
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

        <button className="py-1 px-3 text-sm hover:bg-white/20 rounded-lg text-white">
          RU
        </button>

        <p className="text-gray-400 text-xs mt-1">v25.0.1</p>
      </div>
    </div>
  );
}
