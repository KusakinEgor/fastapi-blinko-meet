import { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import LandingScreen from "./components/screens/LandingScreen";
import JoinRoomScreen from "./components/screens/JoinRoomScreen";
import CreateRoomScreen from "./components/screens/CreateRoomScreen";
import LoginScreen from "./components/screens/LoginScreen";
import JoinScreen from "./components/screens/JoinScreen";
import LoginScreenUser from "./components/screens/LoginScreenUser";
import UserProfile from "./components/screens/UserProfile";

function AppContent() {
  const navigate = useNavigate();

  return (
	<Routes>
	  <Route
		path="/"
		element={
			<LandingScreen
				onJoin={() => navigate("/join")}
				onCreate={() => navigate("/create")}
				onLogin={() => navigate("/login")}
				onLoginUser={() => navigate("/login-user")}
			/>
		}
	  />

	  <Route
		path="/call/:slug"
		element={<JoinScreen onBack={() => navigate("/")} />}
	  />

	  <Route
		path="/join"
		element={<JoinScreen onBack={() => navigate("/")} />}
	  />

	  <Route
		path="/create"
		element={<CreateRoomScreen onBack={() => navigate("/")} />}
	  />

	  <Route
		path="/login"
		element={<LoginScreen onBack={() => navigate("/")} />}
	  />

	  <Route
		path="/login-user"
		element={<LoginScreenUser onBack={() => navigate("/")} />}
	  />

	  <Route
		path="/profile"
		element={<UserProfile />}
	  />
	</Routes>
  );
}

function App() {
	return(
		<BrowserRouter>
			<div className="app-container">
				<AppContent />
			</div>
		</BrowserRouter>
	);
}

export default App;
