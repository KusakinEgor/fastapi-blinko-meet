import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, uploadAvatar, deleteAccount, getProfile, getSettings, updateSettings } from "../../api/user.js";

const EditProfile = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: "",
		email: "",
		dateOfBirth: "",
		avatar: null,
		avatarPreview: null
	});

	const [settings, setSettings] = useState({
		hide_history: false,
		enable_noise_suppression: true,
		theme: "dark",
		language: "ru"
	});

	useEffect(() => {
		const loadAllData = async () => {
			try {
				const [profileData, settingsData] = await Promise.all([
					getProfile(),
					getSettings()
				]);

				setForm({
					username: profileData.display_name || "",
					email: profileData.email || "",
					dateOfBirth: profileData.date_of_birth || "",
					avatarPreview: profileData.avatar_url || null,
					avatar: null
				});

				if (settingsData) {
					setSettings(settingsData);
				}
			} catch (err) {
				console.error("Ошибка загрузки данных:", err);
				const stored = localStorage.getItem("user");
				if (stored) setForm(JSON.parse(stored));
			}
		};

		loadAllData();
	}, []);

	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const handleSettingsChange = (field, value) => {
		console.log("Setting field:", field, "to", value);
		setSettings((prev) => ({ ...prev, [field]: value }));
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

			await Promise.all([
				updateProfile({
					display_name: form.username,
					avatar_url: finalAvatarUrl,
				}),
				updateSettings(settings)
			]);

			const updateForm = { ...form, avatar: null, avatarPreview: finalAvatarUrl };
			setForm(updateForm);
			localStorage.setItem("user", JSON.stringify(updateForm));


			navigate("/profile");
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
					
					<div className="pt-10 mt-10 border-t border-white/5">
						<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Приватность</h3>
						
						<div className="flex items-center justify-between p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
							<div>
								<p className="text-sm font-bold">Скрыть историю встреч</p>
								<p className="text-[10px] text-zinc-500 font-medium mt-1">Другие пользователи не увидят ваши события</p>
							</div>

							<button
								onClick={() => handleSettingsChange("hide_history", !settings.hide_history)}
								className={`w-12 h-6 rounded-full transition-all duration-500 relative ${
									settings.hide_history ? "bg-[#3f81fd]" : "bg-zinc-800"
								}`}
							>
								<div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 ${
									settings.hide_history ? "left-7" : "left-1"
								}`} />
							</button>
						</div>
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
