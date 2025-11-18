import { useEffect, useState } from "react";
import Button from "../ui/Button";
import CreateRoomScreen from "./CreateRoomScreen";

export default function LandingScreen() {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("landing");

  useEffect(() => setLoaded(true), []);

  if (screen === "createRoom") {
    return <CreateRoomScreen onBack={() => setScreen("landing")} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">

      <div
        className={`sm:w-24 bg-white/10 backdrop-blur-xl flex flex-col justify-between items-center p-4 transition-all duration-1000
        ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
      >

        <div className="flex flex-col gap-6 mt-4">
          <Button
            variant="secondary"
            className="flex flex-col items-center py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <span className="text-xl mb-1">🔑</span>
            Login
          </Button>

          <Button
            variant="secondary"
            onClick={() => setScreen("createRoom")}
            className="flex flex-col items-center py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <span className="text-xl mb-1">📅</span>
            Meetings
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-4">
          <p className="text-white font-semibold text-center">BLINKO MEET</p>

          <Button
            variant="secondary"
            className="py-1 px-3 text-sm hover:bg-white/20 rounded-lg"
          >
            RU
          </Button>

          <p className="text-gray-400 text-xs mt-1">v25.0.1</p>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col justify-center items-center p-10 gap-8 relative ml-24 transition-all duration-1000
        ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <div className="text-center">
          <h1 className="text-6xl font-extrabold mb-4">Log in</h1>
          <p className="text-gray-400 text-xl mb-8">
            to manage your meetings and see its history
          </p>
        </div>

        <div className="grid grid-rows-2 grid-cols-2 gap-4 mb-6 w-full max-w-md">
          <Button
            variant="primary"
            className="row-span-2 col-span-1 py-12 bg-gradient-to-br from-blue-400 to-blue-600 hover:scale-105 transition-transform duration-200 rounded-xl shadow-md"
          >
            Big Tile
          </Button>

          <Button
            variant="secondary"
            className="row-span-1 col-span-1 py-6 border border-gray-600 hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-xl"
          >
            Medium Tile
          </Button>

          <Button
            variant="secondary"
            className="row-span-1 col-span-1 py-4 border border-gray-600 hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-xl"
          >
            Small Tile
          </Button>
        </div>

        <Button
          variant="white"
          className="py-3 text-black w-64 hover:scale-105 transition-transform duration-200"
        >
          Sign in as an employee
        </Button>

        <div className="mt-6 w-96 h-48 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
          [Your image here]
        </div>
      </div>
    </div>
  );
}
