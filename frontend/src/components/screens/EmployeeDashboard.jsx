import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployeeStats } from "../../api/employee";
import {
	AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
	BarChart, Bar, Cell
} from "recharts"

const activityData = [
	{ day: "Mon", hours: 2 },
	{ day: "Tue", hours: 5 },
	{ day: "Wed", hours: 3 },
	{ day: "Thu", hours: 8 },
	{ day: "Fri", hours: 6 },
];

const EmployeeDashboard = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("access_token");

		if (!token) {
			navigate("/login", { replace: true });
			return;
		}

		const loadData = async () => {
			try {
				const data = await fetchEmployeeStats();
				setStats(data);
			} catch (error) {
				console.error("Error download data employee:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();

		const timer = setTimeout(() => setLoading(false), 1500);
		return () => clearTimeout(timer);
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		navigate("/", { replace: true });
	};

	const handlePrint = () => {
		window.print();
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#050505] p-6 md:p-12 space-y-8 animate-pulse">
				<div className="h-20 bg-zinc-900/50 rounded-3xl w-full" />
				<div className="grid grid-cols-3 gap-6">
					{[1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-900/50 rounded-2xl" />)}
				</div>
				<div className="h-80 bg-zinc-900/50 rounded-3xl w-full" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12 tracking-tight">
			<style dangerouslySetInnerHTML={{ __html: `
					@media print {
						@page { size: landscape; margin: 10mm; }
						body { background: #050505 !important; -webkit-print-color-adjust: exact; }
						.no-print { display: none !important; }
						.print-area { padding: 0 !important; }
					}
				`}} />
			<div className="max-w-6xl mx-auto space-y-8">
				<div className="flex justify-between items-end">
					<div>
						<h2 className="text-sm uppercase tracking-[0.4em] font-black mb-2">Рабочая панель</h2>
						<p className="text-zinc-600 text-[10px] uppercase tracking-[0.1em]">Аналитика и активность сотрудника</p>
					</div>
					<button
						onClick={handleLogout}
						className="no-print text-zinc-600 hover:text-white text-[9px] uppercase tracking-widest transition border border-white/5 px-4 py-2 rounded-lg"
					>
						Выйти
					</button>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-zinc-900/20 border border-white/5 p-5 rounded-2xl">
						<p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Ближайшая встреча</p>
						<p className="text-sm font-bold underline decoration-[#3f81fd] underline-offset-4">
							{stats.summary.nearest_event}
						</p>
					</div>
					<div className="bg-zinc-900/20 border border-white/5 p-5 rounded-2xl">
						<p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Часов в этом месяце</p>
						<p className="text-sm font-bold">{stats.summary.monthly_hours} ч.</p>
					</div>
					<div className="bg-zinc-900/20 border border-white/5 p-5 rounded-2xl flex justify-between items-center">
						<div>
							<p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Рейтинг вовлеченности</p>
							<p className="text-sm font-bold">{stats.summary.rank}</p>
						</div>
						<div className="w-8 h-8 bg-[#3f81fd]/10 rounded-full flex items-center justify-center text-[#3f81fd] text-[10px] font-black shadow-[0_0_15px_rgba(63,129,253,0.2)]">★</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl shadow-2xl">
						<h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Время в звонках (7дн)</h3>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={stats.chart} margin={{top: 10, right: 10, left: -25, bottom: 0}}>
									<defs>
										<linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#3f81fd" stopOpacity={0.3}/>
											<stop offset="95%" stopColor="#3f81fd" stopOpacity={0}/>
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
									<XAxis
										dataKey="day"
										axisLine={false}
										tickLine={false}
										interval={2}
										tick={{ fill: '#52525b', fontSize: 10, fontWeight: 600 }}
										dy={10}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fill: '#52525b', fontSize: 10 }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: '#09090b',
											border: '1px solid #ffffff10',
											borderRadius: '12px',
											fontSize: '10px',
											color: '#fff'
										}}
										itemStyle={{ color: '#3f81fd', fontWeight: 'bold' }}
										cursor={{ stroke: '#3f81fd', strokeWidth: 1, strokeDasharray: '4 4' }}
									/>
									<Area type="monotone" dataKey="hours" stroke="#3f81fd" fillOpacity={1} fill="url(#colorHours)" strokeWidth={2} dot={{ r: 3, fill: '#3f81fd', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
					
					<div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl shadow-2xl flex flex-col">
						<h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Последние встречи</h3>
						<div className="space-y-4 flex-1">
							{stats.meetings_history.map((meet, idx) => (
								<div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3">
									<div>
										<p className="text-xs font-bold tracking-normal">{meet.title}</p>
										<p className="text-[10px] text-zinc-500 uppercase tracking-widest">{meet.date}</p>
									</div>
									<span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-zinc-400 border border-white/5">
										{meet.duration}
									</span>
								</div>
							))}
						</div>
						<button className="no-print mt-6 text-[#3f81fd] text-[9px] font-black uppercase tracking-widest hover:underline text-left">
							Посмотреть архив встреч
						</button>
					</div>
				</div>
				
				<div className="no-print pt-4">
					<button
						onClick={() => window.print()}
						className="w-full bg-zinc-900 hover:bg-white hover:text-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 transition-all active:scale-[0.98] shadow-2xl"
					>
						Экспортировать отчет в PDF
					</button>
				</div>
			</div>
		</div>
	);
};

export default EmployeeDashboard;
