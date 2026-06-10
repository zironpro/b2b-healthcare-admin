"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, Lock, Mail, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [showPass, setShowPass] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	// Check if already logged in
	React.useEffect(() => {
		const token = localStorage.getItem("admin_token");
		if (token) {
			router.push("/dashboard");
		}
	}, [router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError("Please fill in all fields.");
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const data = await api.login({ email, password });

			// Store JWT and admin info
			localStorage.setItem("admin_token", data.token);
			localStorage.setItem("admin_user", JSON.stringify(data.admin));

			// Redirect to dashboard
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Unable to connect to server. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-12">
			<div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[3.5rem] bg-white shadow-2xl shadow-slate-200/60 lg:grid-cols-2">
				{/* Left: Branding Panel */}
				<div className="relative flex flex-col justify-between overflow-hidden bg-slate-900 p-10 text-white lg:p-14">
					{/* Background glow */}
					<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-primary/20" />
					<div className="absolute -top-32 -right-20 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[100px]" />

					<div className="relative z-10 space-y-10">
						{/* Logo / Brand */}
						<div className="inline-flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
								<ShieldAlert className="h-5 w-5 text-white" />
							</div>
							<span className="font-black text-xl text-white">
								B2 Pro Healthcare
							</span>
						</div>

						<div className="space-y-4">
							<h1 className="font-black text-4xl text-white leading-tight lg:text-5xl">
								Clinical Console<br />
								<span className="text-primary">Admin Portal</span>
							</h1>
							<p className="font-medium text-slate-400 leading-relaxed">
								Access the clinical administrator console to manage appointments, patients, medical staff scheduling, and clinic services.
							</p>
						</div>

						{/* Security & Access Badges */}
						<div className="space-y-4">
							{[
								{ icon: ShieldCheck, text: "Authorized Administration Access" },
								{ icon: Lock, text: "HIPAA-compliant & secure session" },
							].map((item) => (
								<div
									className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
									key={item.text}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
										<item.icon className="h-5 w-5" />
									</div>
									<p className="font-bold text-sm text-slate-300">{item.text}</p>
								</div>
							))}
						</div>
					</div>

					<p className="relative z-10 mt-10 font-medium text-slate-500 text-xs">
						© {new Date().getFullYear()} B2 Pro Healthcare. All rights reserved.
					</p>
				</div>

				{/* Right: Form Panel */}
				<div className="flex flex-col justify-center p-10 lg:p-14">
					<div className="mb-8">
						<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-primary">
							<Sparkles className="h-3.5 w-3.5" /> Security Checkpoint
						</span>
						<h2 className="mt-1 font-heading font-black text-2xl text-slate-900">
							Administrator Sign In
						</h2>
						<p className="mt-2 text-sm text-slate-500 font-medium">
							Provide your credentials to access the console management dashboard.
						</p>
					</div>

					{error && (
						<div className="mb-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-sm font-semibold text-rose-500">
							{error}
						</div>
					)}

					<form className="space-y-5" onSubmit={handleLogin}>
						{/* Email input */}
						<div className="space-y-2">
							<label
								className="font-bold text-slate-700 text-sm"
								htmlFor="email"
							>
								Administrator Email
							</label>
							<div className="relative">
								<Mail className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-slate-400" />
								<Input
									className="h-14 rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-5 text-base"
									id="email"
									onChange={(e) => setEmail(e.target.value)}
									placeholder="admin@healthcare.com"
									required
									type="email"
									value={email}
								/>
							</div>
						</div>

						{/* Password input */}
						<div className="space-y-2">
							<label
								className="font-bold text-slate-700 text-sm"
								htmlFor="password"
							>
								Security Password
							</label>
							<div className="relative">
								<Lock className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-slate-400" />
								<Input
									className="h-14 rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-14 text-base"
									id="password"
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••••••"
									required
									type={showPass ? "text" : "password"}
									value={password}
								/>
								<button
									className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-400 transition-colors hover:text-slate-700 cursor-pointer"
									onClick={() => setShowPass((v) => !v)}
									type="button"
								>
									{showPass ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						<Button
							className="h-14 w-full rounded-2xl bg-primary font-black text-lg text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
							disabled={isLoading}
							type="submit"
						>
							{isLoading ? (
								<span className="flex items-center gap-2">
									<Loader2 className="h-5 w-5 animate-spin" />
									Authenticating Access...
								</span>
							) : (
								"Authenticate Access"
							)}
						</Button>
					</form>

					{/* HIPAA Notice Card */}
					<Card className="mt-8 rounded-3xl border-none bg-slate-50 shadow-none">
						<CardContent className="p-5">
							<p className="font-bold text-slate-500 text-xs text-center leading-relaxed">
								Authorized clinical personnel only. Access attempt logs are tracked for security auditing.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
