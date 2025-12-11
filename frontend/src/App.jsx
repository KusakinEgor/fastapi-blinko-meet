import { useState } from "react";

import LandingScreen from "./components/screens/LandingScreen";
import JoinRoomScreen from "./components/screens/JoinRoomScreen";
import CreateRoomScreen from "./components/screens/CreateRoomScreen";

function App() {
  const [screen, setScreen] = useState("landing");

  function goTo(screenName) {
    setScreen(screenName);
  }

  return (
    <div>
      {screen === "landing" && (
        <LandingScreen
          onJoin={() => goTo("join")}
          onCreate={() => goTo("create")}
        />
      )}

      {screen === "join" && (
        <JoinRoomScreen onBack={() => goTo("landing")} />
      )}

      {screen === "create" && (
        <CreateRoomScreen onBack={() => goTo("landing")} />
      )}
    </div>
  );
}

export default App;
