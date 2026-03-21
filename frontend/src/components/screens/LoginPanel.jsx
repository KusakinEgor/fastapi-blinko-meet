import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPanel({ visible, onClose }) {
    const [animate, setAnimate] = useState(false);
	const navigate = useNavigate();

    useEffect(() => {
        if (visible) {
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
        }
    }, [visible]);

	const handleEmployeeLogin = () => {
		onClose();
		navigate("/login-user");
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
                <button onClick={handleEmployeeLogin} className="rounded-xl font-bold w-full p-4 bg-[#3f81fd]">
                    Sign in as an user
                </button>
            </div>
        </>
    );
}
