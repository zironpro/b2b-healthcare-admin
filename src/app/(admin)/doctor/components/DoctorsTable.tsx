import * as React from "react";
import { Trash2, Edit2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Doctor {
	_id: string;
	name: string;
	email: string;
	phone: string;
	department: string;
	specialization?: string;
	experience?: string;
	successRate?: string;
	image?: string;
	about?: string;
	skills?: string[];
	achievements?: string[];
	status: "active" | "inactive";
	createdAt?: string;
}

interface DoctorsTableProps {
	doctors: Doctor[];
	onDeleteDoctor: (id: string) => void;
	onEditDoctor: (doctor: Doctor) => void;
}

export function DoctorsTable({ doctors, onDeleteDoctor, onEditDoctor }: DoctorsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b border-slate-100 bg-slate-50/70 font-heading font-black text-xs uppercase tracking-wider text-slate-400">
						<th className="py-4 px-6">Specialist</th>
						<th className="py-4 px-6">Department</th>
						<th className="py-4 px-6">Specialization</th>
						<th className="py-4 px-6">Experience</th>
						<th className="py-4 px-6">Contact</th>
						<th className="py-4 px-6">Status</th>
						<th className="py-4 px-6 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-600">
					{doctors.length === 0 ? (
						<tr>
							<td className="py-12 text-center text-slate-400 font-bold" colSpan={7}>
								No medical specialists found in directory.
							</td>
						</tr>
					) : (
						doctors.map((doc) => (
							<tr className="transition-colors hover:bg-slate-50/30" key={doc._id}>
								{/* Name + Avatar */}
								<td className="py-4 px-6">
									<div className="flex items-center gap-3">
										{doc.image ? (
											<img
												alt={doc.name}
												className="h-10 w-10 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = "none";
												}}
												src={doc.image}
											/>
										) : (
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
												<User className="h-4.5 w-4.5" />
											</div>
										)}
										<div>
											<span className="font-bold text-slate-900 block">{doc.name}</span>
											{(doc.skills ?? []).length > 0 && (
												<span className="text-[10px] text-slate-400 font-medium">
													{(doc.skills ?? []).length} skill{(doc.skills ?? []).length !== 1 ? "s" : ""}
													{(doc.achievements ?? []).length > 0 ? ` · ${(doc.achievements ?? []).length} achievement${(doc.achievements ?? []).length !== 1 ? "s" : ""}` : ""}
												</span>
											)}
										</div>
									</div>
								</td>

								{/* Department */}
								<td className="py-4 px-6 capitalize font-bold text-slate-800">
									{doc.department.replace(/-/g, " ")}
								</td>

								{/* Specialization */}
								<td className="py-4 px-6">
									{doc.specialization || (
										<span className="italic text-slate-400 text-xs">General</span>
									)}
								</td>

								{/* Experience / Success Rate */}
								<td className="py-4 px-6">
									<div className="space-y-0.5">
										{doc.experience && (
											<div className="font-bold text-slate-800 text-xs">{doc.experience}</div>
										)}
										{doc.successRate && (
											<div className="text-[10px] text-emerald-600 font-bold">
												✓ {doc.successRate} success
											</div>
										)}
										{!doc.experience && !doc.successRate && (
											<span className="italic text-slate-400 text-xs">—</span>
										)}
									</div>
								</td>

								{/* Contact */}
								<td className="py-4 px-6">
									<div className="text-slate-800 font-semibold">{doc.email}</div>
									<div className="text-xs text-slate-400 mt-0.5">{doc.phone}</div>
								</td>

								{/* Status */}
								<td className="py-4 px-6">
									<span
										className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
											doc.status === "active"
												? "bg-emerald-50 text-emerald-700 border border-emerald-200"
												: "bg-slate-50 text-slate-500 border border-slate-200"
										}`}
									>
										<span
											className={`h-1.5 w-1.5 rounded-full ${
												doc.status === "active" ? "bg-emerald-500" : "bg-slate-400"
											}`}
										/>
										{doc.status === "active" ? "Active" : "Inactive"}
									</span>
								</td>

								{/* Actions */}
								<td className="py-4 px-6 text-right">
									<div className="flex items-center justify-end gap-2">
										<Button
											onClick={() => onEditDoctor(doc)}
											size="sm"
											title="Edit Doctor"
											variant="outline"
										>
											<Edit2 className="h-4 w-4" />
										</Button>
										<Button
											onClick={() => onDeleteDoctor(doc._id)}
											size="sm"
											title="Delete Doctor"
											variant="destructive"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
