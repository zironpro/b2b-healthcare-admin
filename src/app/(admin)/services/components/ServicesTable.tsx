import * as React from "react";
import { Trash2, Edit2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceData {
	_id: string;
	title: string;
	description: string;
	icon: string;
	color?: string;
	image?: string;
	status: "active" | "inactive";
	createdAt?: string;
}

interface ServicesTableProps {
	services: ServiceData[];
	onDeleteService: (id: string) => void;
	onEditService: (service: ServiceData) => void;
}

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
	const IconComponent = (LucideIcons as any)[name];
	if (!IconComponent) {
		return <LucideIcons.Activity className={className} />;
	}
	return <IconComponent className={className} />;
};

export function ServicesTable({ services, onDeleteService, onEditService }: ServicesTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b border-slate-100 bg-slate-50/70 font-heading font-black text-xs uppercase tracking-wider text-slate-400">
						<th className="py-4.5 px-6">Service &amp; Icon</th>
						<th className="py-4.5 px-6">Description</th>
						<th className="py-4.5 px-6">Theme Color</th>
						<th className="py-4.5 px-6">Image URL</th>
						<th className="py-4.5 px-6">Status</th>
						<th className="py-4.5 px-6 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-600">
					{services.length === 0 ? (
						<tr>
							<td className="py-12 text-center text-slate-400 font-bold" colSpan={6}>
								No medical services found. Click &quot;Add Service&quot; to create one.
							</td>
						</tr>
					) : (
						services.map((service) => (
							<tr className="transition-colors hover:bg-slate-50/30" key={service._id}>
								<td className="py-4.5 px-6">
									<div className="flex items-center gap-3">
										<div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 ${service.color || "text-primary"}`}>
											<DynamicIcon className="h-4 w-4" name={service.icon} />
										</div>
										<span className="font-bold text-slate-900">{service.title}</span>
									</div>
								</td>
								<td className="py-4.5 px-6 max-w-xs">
									<div className="truncate text-slate-600 font-semibold" title={service.description}>
										{service.description}
									</div>
								</td>
								<td className="py-4.5 px-6">
									<code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700 font-bold">
										{service.color || "text-primary"}
									</code>
								</td>
								<td className="py-4.5 px-6 max-w-xs">
									{service.image ? (
										<div className="truncate text-xs font-semibold text-slate-400" title={service.image}>
											{service.image}
										</div>
									) : (
										<span className="italic text-slate-400 text-xs">None</span>
									)}
								</td>
								<td className="py-4.5 px-6">
									<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
										service.status === "active"
											? "bg-emerald-50 text-emerald-700 border border-emerald-200"
											: "bg-slate-50 text-slate-500 border border-slate-200"
									}`}>
										<span className={`h-1.5 w-1.5 rounded-full ${service.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
										{service.status === "active" ? "Active" : "Inactive"}
									</span>
								</td>
								<td className="py-4.5 px-6 text-right">
									<div className="flex items-center justify-end gap-2">
										<Button
											onClick={() => onEditService(service)}
											size="sm"
											title="Edit Service"
											variant="outline"
										>
											<Edit2 className="h-4 w-4" />
										</Button>
										<Button
											onClick={() => onDeleteService(service._id)}
											size="sm"
											title="Delete Service"
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
