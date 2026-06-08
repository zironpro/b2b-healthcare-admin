"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowRight, Calendar, Users, Stethoscope } from "lucide-react";
import { api } from "@/lib/api";
import { StatsSection } from "./components/StatsSection";
import { useDashboard } from "../layout";

interface Appointment {
	_id: string;
	patientName: string;
	patientEmail: string;
	patientPhone: string;
	department: string;
	doctor: string;
	date: string;
	notes?: string;
	status: "pending" | "confirmed" | "cancelled";
	createdAt: string;
}

export default function DashboardOverviewPage() {
	const { stats, refreshStats } = useDashboard();
	const [recentBookings, setRecentBookings] = React.useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

	const fetchRecentBookings = async () => {
		try {
			const appData = await api.getAppointments();
			// Take the 5 most recent appointments
			setRecentBookings(appData.slice(0, 5));
		} catch (error) {
			console.error("Error fetching bookings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchRecentBookings();
	}, []);

	const handleUpdateStatus = async (id: string, newStatus: "confirmed" | "cancelled") => {
		setActionLoadingId(id);
		try {
			await api.updateAppointmentStatus(id, newStatus);

			// Optimistically update local summary list
			setRecentBookings((prev) =>
				prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
			);

			// Refresh stats counters
			await refreshStats();
		} catch (err) {
			console.error("Error updating booking status:", err);
			alert("Failed to update status.");
		} finally {
			setActionLoadingId(null);
		}
	};

	return (
		<div className="space-y-8">
			{/* Stats counters grid */}
			<StatsSection stats={stats} />

			{/* Main Grid: Recent Bookings & Console Actions */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Recent Bookings Card */}
				<div className="lg:col-span-2 overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white p-6 shadow-sm">
					<div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
						<div>
							<h3 className="font-heading font-black text-base text-slate-900">Recent Bookings</h3>
							<p className="text-xs font-semibold text-slate-400">Latest appointment scheduling activities</p>
						</div>
						<Link
							href="/bookings"
							className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
						>
							View All Bookings <ArrowRight className="h-3.5 w-3.5" />
						</Link>
					</div>

					{isLoading ? (
						<div className="flex h-48 items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-primary" />
						</div>
					) : recentBookings.length === 0 ? (
						<div className="flex h-48 items-center justify-center text-slate-400 font-bold text-sm">
							No recent appointments scheduled.
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
										<th className="py-3 px-4">Patient</th>
										<th className="py-3 px-4">Specialist</th>
										<th className="py-3 px-4">Date</th>
										<th className="py-3 px-4">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-150 text-xs font-medium text-slate-600">
									{recentBookings.map((booking) => (
										<tr className="hover:bg-slate-50/40 transition-colors" key={booking._id}>
											<td className="py-3.5 px-4">
												<div className="font-bold text-slate-900">{booking.patientName}</div>
												<div className="text-[10px] text-slate-400 mt-0.5">{booking.patientEmail}</div>
											</td>
											<td className="py-3.5 px-4 font-semibold text-slate-800">
												{booking.doctor}
												<div className="text-[10px] text-slate-400 capitalize mt-0.5">{booking.department.replace("-", " ")}</div>
											</td>
											<td className="py-3.5 px-4 text-slate-700 font-semibold">{booking.date}</td>
											<td className="py-3.5 px-4">
												<span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${booking.status === "confirmed"
														? "bg-emerald-50 text-emerald-700 border border-emerald-150"
														: booking.status === "cancelled"
															? "bg-rose-50 text-rose-700 border border-rose-150"
															: "bg-amber-50 text-amber-700 border border-amber-150"
													}`}>
													{booking.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* Quick Actions / Summary Card */}
				<div className="flex flex-col gap-4">
					<div className="rounded-[2rem] border border-slate-200/50 bg-white p-6 shadow-sm flex-1">
						<h3 className="font-heading font-black text-base text-slate-900 mb-2">Console Shortcuts</h3>
						<p className="text-xs font-semibold text-slate-400 mb-4">Direct paths to administrative boards</p>

						<div className="space-y-3">
							<Link
								href="/doctor"
								className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-150 transition-all group"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Stethoscope className="h-4.5 w-4.5" />
									</div>
									<div>
										<div className="font-bold text-xs text-slate-900">Manage Specialists</div>
										<div className="text-[10px] text-slate-400">Add, edit, delete doctor logs</div>
									</div>
								</div>
								<ArrowRight className="h-4 w-4 text-slate-350 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
							</Link>

							<Link
								href="/patients"
								className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-150 transition-all group"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/55 text-blue-650">
										<Users className="h-4.5 w-4.5" />
									</div>
									<div>
										<div className="font-bold text-xs text-slate-900">Patient Registry</div>
										<div className="text-[10px] text-slate-400">Search patient information</div>
									</div>
								</div>
								<ArrowRight className="h-4 w-4 text-slate-350 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
							</Link>

							<Link
								href="/bookings"
								className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-150 transition-all group"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100/55 text-purple-650">
										<Calendar className="h-4.5 w-4.5" />
									</div>
									<div>
										<div className="font-bold text-xs text-slate-900">Booking Requests</div>
										<div className="text-[10px] text-slate-400">Confirm or cancel bookings</div>
									</div>
								</div>
								<ArrowRight className="h-4 w-4 text-slate-350 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
