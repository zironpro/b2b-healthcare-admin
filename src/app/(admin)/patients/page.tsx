"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PatientsTable } from "./components/PatientsTable";
import { Input } from "@/components/ui/input";


interface Patient {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	createdAt: string;
}

export default function PatientsPage() {
	const [patients, setPatients] = React.useState<Patient[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchTerm, setSearchTerm] = React.useState<string>("");

	const fetchPatients = async () => {
		setIsLoading(true);
		try {
			const patData = await api.getPatients();
			setPatients(patData);
		} catch (error) {
			console.error("Error fetching patients:", error);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchPatients();
	}, []);

	const filteredPatients = React.useMemo(() => {
		return patients.filter((pat) => {
			return (
				pat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				pat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(pat.phone && pat.phone.includes(searchTerm))
			);
		});
	}, [patients, searchTerm]);

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
				{/* Search Bar */}
				<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
					<div className="relative flex-1 min-w-[245px]">
						<Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-slate-400" />
						<Input
							className="pl-11"
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search patient directory..."
							type="text"
							value={searchTerm}
						/>
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className="overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white shadow-sm">
				<PatientsTable patients={filteredPatients} />
			</div>
		</div>
	);
}
