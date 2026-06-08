"use client";

import * as React from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { DoctorsTable } from "./components/DoctorsTable";
import { AddEditDoctorModal } from "./components/AddEditDoctorModal";
import { useDashboard } from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


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

export default function DoctorsPage() {
	const { refreshStats } = useDashboard();
	const [doctors, setDoctors] = React.useState<Doctor[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchTerm, setSearchTerm] = React.useState<string>("");

	// Modal and Edit States
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [editingDoctor, setEditingDoctor] = React.useState<Doctor | null>(null);

	const fetchDoctors = async () => {
		setIsLoading(true);
		try {
			const docData = await api.getDoctors();
			setDoctors(docData);
		} catch (error) {
			console.error("Error fetching doctors:", error);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchDoctors();
	}, []);

	const handleSaveDoctor = async (doctorData: {
		name: string;
		email: string;
		phone: string;
		department: string;
		specialization: string;
		status: "active" | "inactive";
		experience: string;
		successRate: string;
		image: string;
		about: string;
		skills: string[];
		achievements: string[];
	}) => {
		try {
			if (editingDoctor) {
				const res = await api.updateDoctor(editingDoctor._id, doctorData);
				setDoctors((prev) =>
					prev.map((doc) => (doc._id === editingDoctor._id ? res.doctor : doc))
				);
			} else {
				const res = await api.createDoctor(doctorData);
				setDoctors((prev) => [res.doctor, ...prev]);
			}
			setIsModalOpen(false);
			setEditingDoctor(null);

			// Sync stats
			await refreshStats();
		} catch (err: any) {
			alert(err.message || "Failed to save doctor.");
			throw err;
		}
	};

	const handleDeleteDoctor = async (id: string) => {
		if (!confirm("Are you sure you want to remove this specialist?")) return;

		try {
			await api.deleteDoctor(id);
			setDoctors((prev) => prev.filter((doc) => doc._id !== id));

			// Sync stats
			await refreshStats();
		} catch (err: any) {
			alert(err.message || "Failed to delete doctor.");
		}
	};

	const filteredDoctors = React.useMemo(() => {
		return doctors.filter((doc) => {
			return (
				doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.phone.includes(searchTerm) ||
				doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(doc.specialization && doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		});
	}, [doctors, searchTerm]);

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
							placeholder="Search doctor directory..."
							type="text"
							value={searchTerm}
						/>
					</div>

					<Button
						onClick={() => {
							setEditingDoctor(null);
							setIsModalOpen(true);
						}}
					>
						<Plus className="h-4.5 w-4.5 mr-1.5" />
						<span>Add Specialist</span>
					</Button>
				</div>
			</div>

			{/* Data Table */}
			<div className="overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white shadow-sm">
				<DoctorsTable
					doctors={filteredDoctors}
					onDeleteDoctor={handleDeleteDoctor}
					onEditDoctor={(doc) => {
						setEditingDoctor(doc);
						setIsModalOpen(true);
					}}
				/>
			</div>

			{/* Add/Edit Form Modal */}
			{isModalOpen && (
				<AddEditDoctorModal
					doctor={editingDoctor}
					onClose={() => {
						setIsModalOpen(false);
						setEditingDoctor(null);
					}}
					onSaveDoctor={handleSaveDoctor}
				/>
			)}
		</div>
	);
}
