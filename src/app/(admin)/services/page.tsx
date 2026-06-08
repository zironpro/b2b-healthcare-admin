"use client";

import * as React from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { ServicesTable } from "./components/ServicesTable";
import { AddEditServiceModal } from "./components/AddEditServiceModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


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

export default function ServicesPage() {
	const [services, setServices] = React.useState<ServiceData[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchTerm, setSearchTerm] = React.useState<string>("");

	// Modals Open / Edit States
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [editingService, setEditingService] = React.useState<ServiceData | null>(null);

	const fetchServices = async () => {
		setIsLoading(true);
		try {
			const servData = await api.getServices();
			setServices(servData);
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchServices();
	}, []);

	const handleSaveService = async (serviceData: {
		title: string;
		description: string;
		icon: string;
		color: string;
		image: string;
		status: "active" | "inactive";
	}) => {
		try {
			if (editingService) {
				const res = await api.updateService(editingService._id, serviceData);
				setServices((prev) =>
					prev.map((s) => (s._id === editingService._id ? res.service : s))
				);
			} else {
				const res = await api.createService(serviceData);
				setServices((prev) => [res.service, ...prev]);
			}
			setIsModalOpen(false);
			setEditingService(null);
		} catch (err: any) {
			alert(err.message || "Failed to save service.");
			throw err;
		}
	};

	const handleDeleteService = async (id: string) => {
		if (!confirm("Are you sure you want to delete this service?")) return;

		try {
			await api.deleteService(id);
			setServices((prev) => prev.filter((s) => s._id !== id));
		} catch (err: any) {
			alert(err.message || "Failed to delete service.");
		}
	};

	const filteredServices = React.useMemo(() => {
		return services.filter((s) => {
			return (
				s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				s.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
	}, [services, searchTerm]);

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
				{/* Search & Actions Bar */}
				<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
					<div className="relative flex-1 min-w-[245px]">
						<Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-slate-400" />
						<Input
							className="pl-11"
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search clinical services..."
							type="text"
							value={searchTerm}
						/>
					</div>

					<Button
						onClick={() => {
							setEditingService(null);
							setIsModalOpen(true);
						}}
					>
						<Plus className="h-4.5 w-4.5 mr-1.5" />
						<span>Add Service</span>
					</Button>
				</div>
			</div>

			{/* Data Table */}
			<div className="overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white shadow-sm">
				<ServicesTable
					onDeleteService={handleDeleteService}
					onEditService={(s) => {
						setEditingService(s);
						setIsModalOpen(true);
					}}
					services={filteredServices}
				/>
			</div>

			{/* Add/Edit Form Modal */}
			{isModalOpen && (
				<AddEditServiceModal
					onClose={() => {
						setIsModalOpen(false);
						setEditingService(null);
					}}
					onSaveService={handleSaveService}
					service={editingService}
				/>
			)}
		</div>
	);
}
