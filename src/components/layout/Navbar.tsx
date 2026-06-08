import * as React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSidebarTrigger } from "@/components/layout/Sidebar";

interface NavbarProps {
	adminName: string;
	handleLogout: () => void;
	activeTab: "dashboard" | "bookings" | "patients" | "doctors" | "services" | "news";
}

export function Navbar({ adminName, handleLogout, activeTab }: NavbarProps) {
	// Dynamically resolve page titles based on active tab
	const tabTitleMap = {
		dashboard: "Clinical Console Overview",
		bookings: "Bookings & Appointments",
		patients: "Patient Directory",
		doctors: "Medical Specialists",
		services: "Clinical Services",
		news: "News & Events Board",
	};

	const title = tabTitleMap[activeTab as keyof typeof tabTitleMap] || "Clinical Admin";

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 py-4 px-6 shadow-sm backdrop-blur-md">
			<div className="flex items-center justify-between">
				{/* Left: Mobile hamburger + Page title */}
				<div className="flex items-center gap-3">
					{/* Mobile sidebar sheet trigger */}
					<MobileSidebarTrigger activeTab={activeTab} adminName={adminName} />

					{/* Page title */}
					<div>
						<h2 className="font-heading font-black text-lg text-slate-900 leading-tight">
							{title}
						</h2>
						<p className="hidden md:block text-xs font-semibold text-slate-400 mt-0.5">
							Clinical operations command center
						</p>
					</div>
				</div>

				{/* Right: Session actions */}
				<Button
					onClick={handleLogout}
					size="sm"
					variant="outline"
				>
					<LogOut className="h-3.5 w-3.5 text-rose-500 mr-1.5" />
					<span className="hidden sm:inline">Sign Out</span>
				</Button>
			</div>
		</header>
	);
}
