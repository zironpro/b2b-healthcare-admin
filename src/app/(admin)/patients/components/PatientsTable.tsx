import * as React from "react";

interface Patient {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	createdAt: string;
}

interface PatientsTableProps {
	patients: Patient[];
}

export function PatientsTable({ patients }: PatientsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b border-slate-100 bg-slate-50/70 font-heading font-black text-xs uppercase tracking-wider text-slate-400">
						<th className="py-4.5 px-6">Name</th>
						<th className="py-4.5 px-6">Email Address</th>
						<th className="py-4.5 px-6">Phone Number</th>
						<th className="py-4.5 px-6">Registration Date</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-600">
					{patients.length === 0 ? (
						<tr>
							<td className="py-12 text-center text-slate-400 font-bold" colSpan={4}>
								No registered patients found in directory.
							</td>
						</tr>
					) : (
						patients.map((pat) => (
							<tr className="transition-colors hover:bg-slate-50/30" key={pat._id}>
								<td className="py-4.5 px-6 font-bold text-slate-900">{pat.name}</td>
								<td className="py-4.5 px-6">{pat.email}</td>
								<td className="py-4.5 px-6">
									{pat.phone || <span className="italic text-slate-300">Not recorded</span>}
								</td>
								<td className="py-4.5 px-6">
									{new Date(pat.createdAt).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
