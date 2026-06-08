"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Mail, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
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
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
			{/* Decorative background gradients */}
			<div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_50%)]" />
			<div className="absolute -top-40 left-10 z-0 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
			<div className="absolute -bottom-40 right-10 z-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px]" />

			<div className="relative z-10 w-full max-w-md">
				{/* Brand Title */}
				<div className="mb-8 text-center">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
						<ShieldAlert className="h-7 w-7" />
					</div>
					<h1 className="font-heading font-black text-3xl tracking-tight text-white">
						B2 Pro <span className="text-emerald-400">Healthcare</span>
					</h1>
					<p className="mt-2 font-medium text-sm text-slate-400">
						Clinical Administrator Console
					</p>
				</div>

				{/* Login Card */}
				<div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl md:p-10">
					<div className="mb-6">
						<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-emerald-400">
							<Sparkles className="h-3.5 w-3.5" /> Security Checkpoint
						</span>
						<h2 className="mt-1 font-heading font-black text-xl text-white">
							Sign In
						</h2>
					</div>

					{error && (
						<div className="mb-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-sm font-semibold text-rose-400">
							{error}
						</div>
					)}

					<form className="space-y-6" onSubmit={handleLogin}>
						{/* Email input */}
						<div className="space-y-2">
							<label className="font-bold text-xs uppercase tracking-wider text-slate-400" htmlFor="email">
								Administrator Email
							</label>
							<div className="relative">
								<Mail className="absolute top-4 left-4 h-5 w-5 text-slate-500" />
								<Input
									className="h-14 pr-4 pl-12 bg-slate-950/60 border-white/5 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/30"
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
							<label className="font-bold text-xs uppercase tracking-wider text-slate-400" htmlFor="password">
								Security Password
							</label>
							<div className="relative">
								<Lock className="absolute top-4 left-4 h-5 w-5 text-slate-500" />
								<Input
									className="h-14 pr-4 pl-12 bg-slate-950/60 border-white/5 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/30"
									id="password"
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••••••"
									required
									type="password"
									value={password}
								/>
							</div>
						</div>

						<Button
							className="h-14 w-full bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20"
							disabled={isLoading}
							type="submit"
						>
							{isLoading ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								"Authenticate Access"
							)}
						</Button>
					</form>
				</div>

				<div className="mt-8 text-center font-bold text-xs text-slate-500">
					Authorized personnel only. HIPAA compliant console.
				</div>
			</div>
		</main>
	);
}
