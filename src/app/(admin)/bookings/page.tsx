"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { BookingsTable } from "./components/BookingsTable";
import { useDashboard } from "../layout";
import { Input } from "@/components/ui/input";


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

export default function BookingsPage() {
	const { refreshStats } = useDashboard();
	const [appointments, setAppointments] = React.useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [searchTerm, setSearchTerm] = React.useState<string>("");
	const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

	const fetchAppointments = async () => {
		setIsLoading(true);
		try {
			const appData = await api.getAppointments();
			setAppointments(appData);
		} catch (error) {
			console.error("Error fetching appointments:", error);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchAppointments();
	}, []);

	const updateAppointmentStatus = async (id: string, newStatus: "confirmed" | "cancelled") => {
		setActionLoadingId(id);
		try {
			await api.updateAppointmentStatus(id, newStatus);

			// Optimistically update lists
			setAppointments((prev) =>
				prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
			);

			// Re-fetch stats
			await refreshStats();
		} catch (err) {
			console.error("Error updating appointment:", err);
			alert("Failed to update appointment status.");
		} finally {
			setActionLoadingId(null);
		}
	};

	const filteredAppointments = React.useMemo(() => {
		return appointments.filter((app) => {
			const matchesStatus = statusFilter === "all" || app.status === statusFilter;
			const matchesSearch =
				app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.patientPhone.includes(searchTerm) ||
				app.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.department.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesStatus && matchesSearch;
		});
	}, [appointments, statusFilter, searchTerm]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Workspace Control Bar */}
			<div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
				{/* Search & Filter Bar */}
				<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
					<div className="relative flex-1 min-w-[245px]">
						<Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-slate-400" />
						<Input
							className="pl-11"
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search bookings name, specialist..."
							type="text"
							value={searchTerm}
						/>
					</div>

					<div className="relative">
						<select
							className="flex h-12 cursor-pointer items-center rounded-2xl border border-slate-200 bg-white pr-10 pl-5 font-bold text-sm text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
							onChange={(e) => setStatusFilter(e.target.value)}
							value={statusFilter}
						>
							<option value="all">Filter: All Statuses</option>
							<option value="pending">Status: Pending</option>
							<option value="confirmed">Status: Confirmed</option>
							<option value="cancelled">Status: Cancelled</option>
						</select>
					</div>
				</div>
			</div>

			{/* Data Explorer Table Container */}
			<div className="overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white shadow-sm">
				<BookingsTable
					actionLoadingId={actionLoadingId}
					appointments={filteredAppointments}
					onUpdateStatus={updateAppointmentStatus}
				/>
			</div>
		</div>
	);
}
