import * as React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}

interface BookingsTableProps {
	appointments: Appointment[];
	actionLoadingId: string | null;
	onUpdateStatus: (id: string, status: "confirmed" | "cancelled") => void;
}

export function BookingsTable({
	appointments,
	actionLoadingId,
	onUpdateStatus,
}: BookingsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b border-slate-100 bg-slate-50/70 font-heading font-black text-xs uppercase tracking-wider text-slate-400">
						<th className="py-4.5 px-6">Patient Details</th>
						<th className="py-4.5 px-6">Clinic Info</th>
						<th className="py-4.5 px-6">Date</th>
						<th className="py-4.5 px-6">Narrative / Symptoms</th>
						<th className="py-4.5 px-6 text-center">Status</th>
						<th className="py-4.5 px-6 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-600">
					{appointments.length === 0 ? (
						<tr>
							<td className="py-12 text-center text-slate-400 font-bold" colSpan={6}>
								No clinical appointment records found matching your filters.
							</td>
						</tr>
					) : (
						appointments.map((app) => (
							<tr className="transition-colors hover:bg-slate-50/30" key={app._id}>
								<td className="py-4.5 px-6">
									<div className="font-bold text-slate-900">{app.patientName}</div>
									<div className="text-xs text-slate-400 mt-0.5">{app.patientEmail}</div>
									<div className="text-xs text-slate-400">{app.patientPhone}</div>
								</td>
								<td className="py-4.5 px-6">
									<div className="capitalize font-bold text-slate-800">
										{app.department.replace("-", " ")}
									</div>
									<div className="text-xs text-slate-400 mt-0.5">Doctor ID: {app.doctor}</div>
								</td>
								<td className="py-4.5 px-6 whitespace-nowrap">
									<div className="font-bold text-slate-800">
										{new Date(app.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</div>
								</td>
								<td className="py-4.5 px-6 max-w-xs">
									<p className="truncate text-xs text-slate-500" title={app.notes}>
										{app.notes || <span className="italic text-slate-300">No notes provided</span>}
									</p>
								</td>
								<td className="py-4.5 px-6 text-center">
									<Badge
										variant={
											app.status === "confirmed"
												? "success"
												: app.status === "cancelled"
													? "destructive"
													: "warning"
										}
									>
										{app.status}
									</Badge>
								</td>
								<td className="py-4.5 px-6 text-right">
									{actionLoadingId === app._id ? (
										<Loader2 className="inline-block h-5 w-5 animate-spin text-slate-400" />
									) : (
										<div className="flex justify-end gap-2">
											{app.status !== "confirmed" && (
												<Button
													onClick={() => onUpdateStatus(app._id, "confirmed")}
													size="sm"
													title="Confirm Appointment"
													variant="outline"
												>
													<Check className="h-4 w-4 text-emerald-600" />
												</Button>
											)}
											{app.status !== "cancelled" && (
												<Button
													onClick={() => onUpdateStatus(app._id, "cancelled")}
													size="sm"
													title="Cancel Appointment"
													variant="destructive"
												>
													<X className="h-4 w-4" />
												</Button>
											)}
										</div>
									)}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
