import { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./i18n";

import LandingScreen from "./components/screens/LandingScreen";
import JoinRoomScreen from "./components/screens/JoinRoomScreen";
import CreateRoomScreen from "./components/screens/CreateRoomScreen";
import LoginScreen from "./components/screens/LoginScreen";
import JoinScreen from "./components/screens/JoinScreen";
import LoginScreenUser from "./components/screens/LoginScreenUser";
import UserProfile from "./components/screens/UserProfile";
import MeetRoom from "./components/screens/MeetRoom";
import EditProfile from "./components/screens/EditProfile";
import AdminDashboard from "./components/screens/AdminDashboard";
import AdminAuth from "./components/screens/AdminLogin";
import EmojiGuide from "./components/chat/EmojiGuide";
import MeetingSummaryProfile from "./components/screens/MeetingSummaryProfile";
import EmployeeDashboard from "./components/screens/EmployeeDashboard";

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
		path="/meet-room/:slug"
		element={<MeetRoom />}
	  />

	  <Route
		path="/call/:slug"
		element={<JoinScreen 
			onBack={() => navigate("/")} 
			onJoin={(data) => {
				console.log("User login:", data);
				navigate(`/meet-room/${data.slug}`);
			}} />}
	  />

	  <Route
		path="/join"
		element={<JoinScreen onBack={() => navigate("/")} onJoin={(data) => console.log("Log In:", data)} />}
	  />

	  <Route
		path="/create"
		element={<CreateRoomScreen onBack={() => navigate("/")} />}
	  />

	  <Route
		path="/login"
		element={
			<LoginScreen
				onBack={() => navigate("/")}
				onLogin={(data) => {
					navigate("/employee-dashboard");
				}}
			/>
		}
	  />

	  <Route
		path="/login-user"
		element={<LoginScreenUser onBack={() => navigate("/")} onLogin={() => navigate("/profile")} />}
	  />

	  <Route
		path="/profile"
		element={<UserProfile />}
	  />

	  <Route
		path="/profile/:id"
		element={<UserProfile />}
	  />

	  <Route
		path="/profile/edit"
		element={<EditProfile />}
	  />

	  <Route
		path="/summary/:roomId"
		element={<MeetingSummaryProfile />}
	  />

	  <Route
		path="/admin"
		element={
			<AdminAuth>
				<AdminDashboard />
			</AdminAuth>
		}
	  />

	  <Route
		path="/employee-dashboard"
		element={<EmployeeDashboard />}
	  />

	  <Route
		path="/emoji-guide"
		element={<EmojiGuide />}
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
