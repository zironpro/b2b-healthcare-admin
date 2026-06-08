"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Calendar,
	Users,
	Stethoscope,
	ShieldCheck,
	User,
	Activity,
	Newspaper,
	Menu,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface SidebarProps {
	activeTab: "dashboard" | "bookings" | "patients" | "doctors" | "services" | "news";
	adminName: string;
}

const navLinks = [
	{ href: "/dashboard", label: "Dashboard", icon: Activity, tab: "dashboard" },
	{ href: "/bookings", label: "Bookings", icon: Calendar, tab: "bookings" },
	{ href: "/patients", label: "Patients", icon: Users, tab: "patients" },
	{ href: "/doctor", label: "Doctors", icon: Stethoscope, tab: "doctors" },
	{ href: "/services", label: "Services", icon: ShieldCheck, tab: "services" },
	{ href: "/news", label: "News & Events", icon: Newspaper, tab: "news" },
] as const;

function NavContent({
	activeTab,
	adminName,
	onLinkClick,
}: {
	activeTab: string;
	adminName: string;
	onLinkClick?: () => void;
}) {
	return (
		<div className="flex flex-col h-full justify-between">
			<div className="space-y-8">
				{/* Logo / Brand Header */}
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<ShieldCheck className="h-6 w-6" />
					</div>
					<div>
						<h1 className="font-heading font-black text-base text-slate-900 leading-tight">
							B2 Pro <span className="text-primary">Admin</span>
						</h1>
						<p className="text-[10px] font-semibold text-slate-400">HIPAA Compliant Console</p>
					</div>
				</div>

				{/* Navigation Links */}
				<nav className="space-y-1">
					{navLinks.map(({ href, label, icon: Icon, tab }) => (
						<Link
							key={href}
							href={href}
							onClick={onLinkClick}
							className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-heading font-black text-sm transition-all ${
								activeTab === tab
									? "bg-primary text-white shadow-md shadow-primary/15"
									: "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
							}`}
						>
							<Icon className="h-4 w-4 shrink-0" />
							<span>{label}</span>
						</Link>
					))}
				</nav>
			</div>

			{/* User Profile Info Card */}
			<div className="flex items-center gap-3 border-t border-slate-100 pt-5">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200">
					<User className="h-5 w-5" />
				</div>
				<div className="overflow-hidden">
					<div className="truncate font-heading font-black text-sm text-slate-900">{adminName}</div>
					<div className="text-[10px] font-semibold text-slate-400 capitalize">Console Administrator</div>
				</div>
			</div>
		</div>
	);
}

export function MobileSidebarTrigger({
	activeTab,
	adminName,
}: SidebarProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
					aria-label="Open navigation menu"
				>
					<Menu className="h-4.5 w-4.5" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="w-64 p-6 flex flex-col">
				<SheetHeader className="sr-only">
					<SheetTitle>Navigation Menu</SheetTitle>
				</SheetHeader>
				<NavContent
					activeTab={activeTab}
					adminName={adminName}
					onLinkClick={() => setOpen(false)}
				/>
			</SheetContent>
		</Sheet>
	);
}

export function Sidebar({ activeTab, adminName }: SidebarProps) {
	return (
		<aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 border-r border-slate-200 bg-white p-6 shadow-sm md:flex md:flex-col">
			<NavContent activeTab={activeTab} adminName={adminName} />
		</aside>
	);
}
