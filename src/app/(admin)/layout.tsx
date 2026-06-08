"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

// Components
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

interface Stats {
	totalPatients: number;
	totalAppointments: number;
	pendingAppointments: number;
	confirmedAppointments: number;
	cancelledAppointments: number;
}

interface DashboardContextType {
	stats: Stats;
	refreshStats: () => Promise<void>;
}

export const DashboardContext = React.createContext<DashboardContextType | null>(null);

export function useDashboard() {
	const context = React.useContext(DashboardContext);
	if (!context) {
		throw new Error("useDashboard must be used within a DashboardLayout");
	}
	return context;
}

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [adminName, setAdminName] = React.useState("Administrator");
	const [stats, setStats] = React.useState<Stats>({
		totalPatients: 0,
		totalAppointments: 0,
		pendingAppointments: 0,
		confirmedAppointments: 0,
		cancelledAppointments: 0,
	});
	const [isLoading, setIsLoading] = React.useState(true);

	// Resolve active tab from pathname
	const activeTab = React.useMemo((): "dashboard" | "bookings" | "patients" | "doctors" | "services" | "news" => {
		if (pathname.includes("/bookings")) return "bookings";
		if (pathname.includes("/patients")) return "patients";
		if (pathname.includes("/doctor")) return "doctors";
		if (pathname.includes("/services")) return "services";
		if (pathname.includes("/news")) return "news";
		return "dashboard";
	}, [pathname]);

	const fetchStats = async () => {
		try {
			const statsData = await api.getStats();
			setStats(statsData);
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	React.useEffect(() => {
		const token = localStorage.getItem("admin_token");
		const userStr = localStorage.getItem("admin_user");

		if (!token) {
			router.push("/");
			return;
		}

		if (userStr) {
			try {
				const user = JSON.parse(userStr);
				setAdminName(user.name || "Administrator");
			} catch (e) {
				// ignore
			}
		}

		const init = async () => {
			await fetchStats();
			setIsLoading(false);
		};
		init();
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem("admin_token");
		localStorage.removeItem("admin_user");
		router.push("/");
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="font-heading font-black text-slate-600">Loading Clinical Console...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F9FA] text-slate-800">
			{/* Persistent Sidebar */}
			<Sidebar activeTab={activeTab} adminName={adminName} />

			<div className="md:pl-64">
				{/* Sticky Navbar */}
				<Navbar adminName={adminName} handleLogout={handleLogout} activeTab={activeTab} />

				{/* Workspace Viewport */}
				<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
					<DashboardContext.Provider value={{ stats, refreshStats: fetchStats }}>
						{children}
					</DashboardContext.Provider>
				</main>
			</div>
		</div>
	);
}
