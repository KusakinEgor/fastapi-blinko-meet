import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPanel({ visible, onClose }) {
    const [animate, setAnimate] = useState(false);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const stored = localStorage.getItem("user");

		if (stored) {
			setUser(JSON.parse(stored));
		}
	}, []);

	const isLoggedIn = !!localStorage.getItem("access_token");

    useEffect(() => {
        if (visible) {
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
        }
    }, [visible]);

	const handleAction = () => {
		onClose();

		if (isLoggedIn) {
			navigate("/profile");
		} else {
			navigate("/login-user")
		}
	};

    if (!visible) return null;

    return (
        <>
            <div
                className={`
                    fixed inset-0 bg-black/40 backdrop-blur-sm
                    transition-opacity duration-500
                    ${animate ? "opacity-100" : "opacity-0"}
                `}
                onClick={onClose}
            />

            <div
                className={`
                    fixed left-20 top-12 h-[90%] w-80
                    bg-[#0f0f0f] border border-white/10
                    rounded-2xl p-6 z-50
                    transition-all duration-500 ease-out
                    ${animate ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
                `}
                onClick={(e) => e.stopPropagation()} 
            >
				{isLoggedIn ? (
					<div className="flex flex-col h-full">
						<div className="flex items-center gap-4 mb-8 p-2">
							{user?.avatarPreview ? (
								<img
									src={user.avatarPreview}
									className="w-12 h-12 rounded-full object-cover border border-white/10"
								/>
							) : (
								<div className="w-12 h-12 bg-zinc-800 rounded-full border border-white/10 flex items-center justify-center text-xl">
									{user?.username?.charAt(0) || "👤"}
								</div>
							)}
							
							<div>
								<p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
									Account
								</p>
								<p className="font-bold text-white">
									{user?.username || "Unknown"}
								</p>
							</div>
						</div>
						
						<button
							onClick={handleAction}
							className="rounded-xl font-bold w-full p-4 bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors"
						>
							Перейти в профиль
						</button>

						<button
							onClick={() => {
								localStorage.removeItem("access_token");
								onClose();
								navigate("/");
							}}
							className="mt-auto text-[10px] text-zinc-600 hover:text-red-500 uppercase font-bold tracking-[0.2em] transition-colors"
						>
							Log Out
						</button>
					</div>
				) : (
					<button onClick={handleAction} className="rounded-xl font-bold w-full p-4 bg-[#3f81fd]">
						Sign in as an user
					</button>
				)}
            </div>
        </>
    );
}
