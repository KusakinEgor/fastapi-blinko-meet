import React, { useState } from "react";

const LoginScreenUser = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    onLogin({ username, password });
  };
  
  const handleSubmit = async () => {
	  const url = isRegister
		? "http://localhost:8000/register"
		: "http://localhost:8000/login";

	  const body = isRegister
		? { email, password, username }
		: { email, password };

	  try {
		  const res = await fetch(url, {
			  method: "POST",
			  headers: { "Content-Type": "application/json" },
			  body: JSON.stringify(body)
		  });

		  if (!res.ok) {
			  const err = await res.json();
			  console.error(err);
			  alert(err.detail || "Error");
			  return;
		  }

		  const data = await res.json();

		  if (!isRegister) {
			  localStorage.setItem("access_token", data.access_token);
			  onLogin();
		  } else {
			  alert("Registration success!");
			  setIsRegister(false);
		  }

		  console.log("SUCCESS:", data);
	  } catch (err) {
		  console.error(err);
	  }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white p-4 gap-8">
      <svg onClick={onBack} className="absolute top-4 left-4 w-6 h-6 text-white hover:cursor-pointer" viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.651 3.356a1.235 1.235 0 010 1.72L9.874 12l6.777 6.924a1.235 1.235 0 010 1.72 1.173 1.173 0 01-1.683 0l-7.62-7.784A1.23 1.23 0 017 12c0-.322.125-.632.349-.86l7.619-7.784a1.173 1.173 0 011.683 0z"
          fill="currentColor"
        ></path>
      </svg>

      <div className="flex flex-col items-center gap-1">
        <span className="text-white font-bold text-[50px] text-center">
			{isRegister ? "Create account" : "Welcome back"}
		</span>
        <span className="text-[#999999] font-semibold text-center">
			{isRegister ? "Join the comminity and start meeting" : "Enter your email and password"}
		</span>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
		{isRegister && (
			<div className="relative w-full">
			  <input
				type="text"
				id="username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="peer w-full h-16 px-4 pt-5 pb-2 rounded-xl bg-[#171717] text-white placeholder-transparent outline-none"
				placeholder="Username or Email"
			  />
			  <label
				htmlFor="username"
				className="absolute left-4 top-2 text-[#999999] font-bold text-sm transition-all duration-200
						   peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
						   peer-focus:top-2 peer-focus:text-sm"
			  >
				Username
			  </label>
			</div>
		)}

        <div className="relative w-full">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full h-16 px-4 pt-5 pb-2 rounded-xl bg-[#171717] text-white placeholder-transparent outline-none"
            placeholder="Email"
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-2 text-[#999999] font-bold text-sm transition-all duration-200
                       peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                       peer-focus:top-2 peer-focus:text-sm"
          >
            Email address
          </label>
        </div>
		
        <div className="relative w-full">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full h-16 px-4 pt-5 pb-2 rounded-xl bg-[#171717] text-white placeholder-transparent outline-none"
            placeholder="Password"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-2 text-[#999999] font-bold text-sm transition-all duration-200
                       peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                       peer-focus:top-2 peer-focus:text-sm"
          >
			Password 
          </label>
        </div>

		{!isRegister && (
			<div className="text-left text-sm font-semibold text-[#0088ce] cursor-pointer hover:underline">
			  Reset Password
			</div>
		)}

        <div
          onClick={handleSubmit}
          className="bg-[#3f81fd] text-white py-3 rounded-lg text-center cursor-pointer"
        >
			{isRegister ? "Sign Up" : "Log In"} 
        </div>

		<div className="text-center text-sm text-[#999999] mt-4">
			{isRegister ? "Already have an account?" : "Don't have and account?"}{" "}
			<span
				onClick={() => setIsRegister(!isRegister)}
				className="text-[#3f81fd] cursor-pointer font-bold hover:underline"
			>
				{isRegister ? "Log In" : "Create one"}
			</span>
		</div>
      </div>
    </div>
  );
};

export default LoginScreenUser;
