import * as React from "react";
import { Users, Calendar, Clock, Check, X } from "lucide-react";

interface Stats {
	totalPatients: number;
	totalAppointments: number;
	pendingAppointments: number;
	confirmedAppointments: number;
	cancelledAppointments: number;
}

interface StatsSectionProps {
	stats: Stats;
}

export function StatsSection({ stats }: StatsSectionProps) {
	return (
		<section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-6">
			{/* Total Patients */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
				<div className="flex items-center justify-between mb-3">
					<span className="font-bold text-xs uppercase tracking-wider text-slate-400">Total Patients</span>
					<div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
						<Users className="h-5 w-5" />
					</div>
				</div>
				<h3 className="font-heading font-black text-2xl text-slate-900">{stats.totalPatients}</h3>
				<p className="mt-1 text-[10px] font-semibold text-slate-400 font-heading">Registered patients</p>
			</div>

			{/* Total Bookings */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
				<div className="flex items-center justify-between mb-3">
					<span className="font-bold text-xs uppercase tracking-wider text-slate-400">Total Bookings</span>
					<div className="rounded-xl bg-purple-500/10 p-2 text-purple-500">
						<Calendar className="h-5 w-5" />
					</div>
				</div>
				<h3 className="font-heading font-black text-2xl text-slate-900">{stats.totalAppointments}</h3>
				<p className="mt-1 text-[10px] font-semibold text-slate-400 font-heading">Appointment requests</p>
			</div>

			{/* Pending */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
				<div className="flex items-center justify-between mb-3">
					<span className="font-bold text-xs uppercase tracking-wider text-slate-400">Pending</span>
					<div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
						<Clock className="h-5 w-5" />
					</div>
				</div>
				<h3 className="font-heading font-black text-2xl text-slate-900">{stats.pendingAppointments}</h3>
				<p className="mt-1 text-[10px] font-semibold text-slate-400 font-heading">Awaiting coordinator</p>
			</div>

			{/* Confirmed */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
				<div className="flex items-center justify-between mb-3">
					<span className="font-bold text-xs uppercase tracking-wider text-slate-400">Confirmed</span>
					<div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
						<Check className="h-5 w-5" />
					</div>
				</div>
				<h3 className="font-heading font-black text-2xl text-slate-900">{stats.confirmedAppointments}</h3>
				<p className="mt-1 text-[10px] font-semibold text-slate-400 font-heading">Approved clinical slots</p>
			</div>

			{/* Cancelled */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
				<div className="flex items-center justify-between mb-3">
					<span className="font-bold text-xs uppercase tracking-wider text-slate-400">Cancelled</span>
					<div className="rounded-xl bg-rose-500/10 p-2 text-rose-500">
						<X className="h-5 w-5" />
					</div>
				</div>
				<h3 className="font-heading font-black text-2xl text-slate-900">{stats.cancelledAppointments}</h3>
				<p className="mt-1 text-[10px] font-semibold text-slate-400 font-heading">Rescheduled or rejected</p>
			</div>
		</section>
	);
}
