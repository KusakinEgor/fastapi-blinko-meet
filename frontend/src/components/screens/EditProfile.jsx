import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, uploadAvatar, deleteAccount } from "../../api/user.js";

const EditProfile = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: "",
		email: "",
		dateOfBirth: "",
		avatar: null,
		avatarPreview: null
	});

	useEffect(() => {
		const stored = localStorage.getItem("user");

		if (stored) {
			const parsed = JSON.parse(stored);
			setForm({
				...parsed,
				avatarPreview: parsed.avatarPreview || null
			});
		}
	}, []);

	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setForm((prev) => ({
			...prev,
			avatar: file,
			avatarPreview: URL.createObjectURL(file)
		}));
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Вы уверены, что хотите удалить аккаунт? Все данные будут стерты навсегда."
		);

		if (confirmed) {
			try {
				await deleteAccount();

				localStorage.removeItem("user");
				localStorage.removeItem("access_token");

				navigate("/login");
			} catch (err) {
				console.error("Error deleting account:", err);
				alert("Не удалось удалить аккаунт");
			}
		}
	};

	const handleSave = async () => {
		try {
			let finalAvatarUrl = form.avatarPreview;

			if (form.avatar) {
				const uploadRes = await uploadAvatar(form.avatar);
				if (uploadRes.status === "success") {
					finalAvatarUrl = uploadRes.url;
				} else {
					throw new Error("Error with download file on server");
				}
			}

			if (finalAvatarUrl && finalAvatarUrl.startsWith("blob:")) {
				finalAvatarUrl = undefined;
			}

			const result = await updateProfile({
				display_name: form.username,
				avatar_url: finalAvatarUrl,
			});

			if (result) {
				const updateForm = { ...form, avatar: null, avatarPreview: finalAvatarUrl };
				setForm(updateForm);
				localStorage.setItem("user", JSON.stringify(updateForm));

				navigate("/profile")
			}
		} catch (err) {
			console.error("Error save:", err);
			alert("Не удалось сохранить профиль");
		}
	};

	return (
		<div className="min-h-screen bg-[#050505] text-white flex justify-center p-6">
			<div className="w-full max-w-xl">
				<div className="flex justify-between items-center mb-8">
					<button
						onClick={() => navigate("/profile")}
						className="text-zinc-500 hover:text-white"
					>
						Назад
					</button>

					<button
						onClick={handleSave}
						className="text-blue-400 hover:text-blue-300"
					>
						Сохранить
					</button>
				</div>
				
				<div className="flex flex-col items-center gap-4 mb-8">
					<div className="relative">
						{form.avatarPreview ? (
							<img
								src={form.avatarPreview}
								className="w-24 h-24 rounded-full object-cover"
							/>
						) : (
							<div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-3xl">
								{form.username?.charAt(0) || "?"}
							</div>
						)}
						
						<input 
							type="file"
							onChange={handleAvatarChange}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
					</div>
					
					<p className="text-xs text-zinc-500">Нажми, чтобы изменить аватар</p>
				</div>

				<div className="space-y-4">
					<div>
						<label className="text-xs text-zinc-500">Username</label>
						<input 
							value={form.username}
							onChange={(e) => handleChange("username", e.target.value)}
							className="w-full mt-1 p-3 bg-zinc-900 rounded-lg outline-none"
						/>
					</div>

					<div>
						<label className="text-xs text-zinc-500">Email</label>
						<input
							type="email"
							value={form.email}
							onChange={(e) => handleChange("email", e.target.value)}
							className="w-full mt-1 p-3 bg-zinc-900 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 transition-all"
							placeholder="example@mail.com"
						/>
					</div>
					
					<div>
						<label className="text-xs text-zinc-500">Дата рождения</label>
						<input 
							type="date"
							value={form.dateOfBirth || ""}
							onChange={(e) => handleChange("dateOfBirth", e.target.value)}
							className="w-full mt-1 p-3 bg-zinc-900 rounded-lg outline-none"
						/>
					</div>
					
					<div className="pt-10 mt-10 border-t border-zinc-800">
						<button
							onClick={handleDeleteAccount}
							className="w-full p-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
						>
							Удалить аккаунт
						</button>
						<p className="text-center text-[10px] text-zinc-600 mt-2">
							Все ваши данные будут безвозвратно удалены.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
