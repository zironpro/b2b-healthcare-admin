import * as React from "react";
import { X, Loader2, Plus, Trash2, User, Briefcase, FileText, ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

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
}

interface DoctorFormData {
	name: string;
	email: string;
	phone: string;
	department: string;
	specialization: string;
	experience: string;
	successRate: string;
	image: string;
	about: string;
	skills: string[];
	achievements: string[];
	status: "active" | "inactive";
}

interface AddEditDoctorModalProps {
	onClose: () => void;
	onSaveDoctor: (doctorData: DoctorFormData) => Promise<void>;
	doctor?: Doctor | null;
}

const TABS = [
	{ id: "basic", label: "Basic Info", icon: User },
	{ id: "profile", label: "Profile", icon: Briefcase },
	{ id: "details", label: "Details", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TagInput({
	label,
	placeholder,
	values,
	onChange,
}: {
	label: string;
	placeholder: string;
	values: string[];
	onChange: (v: string[]) => void;
}) {
	const [input, setInput] = React.useState("");

	const add = () => {
		const trimmed = input.trim();
		if (trimmed && !values.includes(trimmed)) {
			onChange([...values, trimmed]);
		}
		setInput("");
	};

	const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

	return (
		<div className="space-y-2">
			<label className="font-bold text-xs uppercase tracking-wider text-slate-500">
				{label}
			</label>
			<div className="flex gap-2">
				<Input
					className="flex-1"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							add();
						}
					}}
					onChange={(e) => setInput(e.target.value)}
					placeholder={placeholder}
					type="text"
					value={input}
				/>
				<Button onClick={add} size="sm" type="button" variant="outline">
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			{values.length > 0 && (
				<div className="flex flex-wrap gap-2 pt-1">
					{values.map((v, i) => (
						<span
							className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
							key={i}
						>
							{v}
							<button
								className="hover:text-red-500 transition-colors"
								onClick={() => remove(i)}
								type="button"
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function AddEditDoctorModal({
	onClose,
	onSaveDoctor,
	doctor,
}: AddEditDoctorModalProps) {
	const [activeTab, setActiveTab] = React.useState<TabId>("basic");
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	// Form state
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [phone, setPhone] = React.useState("");
	const [department, setDepartment] = React.useState("general-care");
	const [specialization, setSpecialization] = React.useState("");
	const [status, setStatus] = React.useState<"active" | "inactive">("active");
	const [experience, setExperience] = React.useState("");
	const [successRate, setSuccessRate] = React.useState("");
	const [image, setImage] = React.useState("");
	const [isUploading, setIsUploading] = React.useState(false);
	const [about, setAbout] = React.useState("");
	const [skills, setSkills] = React.useState<string[]>([]);
	const [achievements, setAchievements] = React.useState<string[]>([]);

	// Populate when editing
	React.useEffect(() => {
		if (doctor) {
			setName(doctor.name);
			setEmail(doctor.email);
			setPhone(doctor.phone);
			setDepartment(doctor.department || "general-care");
			setSpecialization(doctor.specialization || "");
			setStatus(doctor.status || "active");
			setExperience(doctor.experience || "");
			setSuccessRate(doctor.successRate || "");
			setImage(doctor.image || "");
			setAbout(doctor.about || "");
			setSkills(doctor.skills || []);
			setAchievements(doctor.achievements || []);
		} else {
			setName(""); setEmail(""); setPhone("");
			setDepartment("general-care"); setSpecialization("");
			setStatus("active"); setExperience(""); setSuccessRate("");
			setImage(""); setAbout(""); setSkills([]); setAchievements([]);
		}
		setActiveTab("basic");
	}, [doctor]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !phone || !department) {
			setActiveTab("basic");
			alert("Please fill in all required fields (Basic Info tab).");
			return;
		}

		setIsSubmitting(true);
		try {
			await onSaveDoctor({
				name, email, phone, department, specialization, status,
				experience, successRate, image, about, skills, achievements,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const tabIndex = TABS.findIndex((t) => t.id === activeTab);
	const canGoBack = tabIndex > 0;
	const canGoNext = tabIndex < TABS.length - 1;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
			<div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-8 pt-7 pb-5 shrink-0">
					<div>
						<h3 className="font-heading font-black text-xl text-slate-900">
							{doctor ? "Edit Specialist Profile" : "Add Medical Specialist"}
						</h3>
						<p className="text-slate-400 text-xs font-medium mt-0.5">
							Fill all sections for a complete profile visible on the frontend.
						</p>
					</div>
					<button
						className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
						onClick={onClose}
						type="button"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Tab Bar */}
				<div className="flex border-b border-slate-100 bg-slate-50/60 shrink-0">
					{TABS.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
									activeTab === tab.id
										? "border-primary text-primary bg-white"
										: "border-transparent text-slate-400 hover:text-slate-600"
								}`}
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								type="button"
							>
								<Icon className="h-3.5 w-3.5" />
								{tab.label}
							</button>
						);
					})}
				</div>

				{/* Scrollable Form Content */}
				<form className="flex flex-col flex-1 overflow-hidden" onSubmit={handleSubmit}>
					<div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
						{/* ── Tab 1: Basic Info ── */}
						{activeTab === "basic" && (
							<>
								{/* Name */}
								<div className="space-y-2">
									<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docName">
										Doctor Name *
									</label>
									<Input
										id="docName"
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g. Dr. Sarah Mitchell"
										required
										type="text"
										value={name}
									/>
								</div>

								{/* Email */}
								<div className="space-y-2">
									<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docEmail">
										Email Address *
									</label>
									<Input
										id="docEmail"
										onChange={(e) => setEmail(e.target.value)}
										placeholder="doctor@healthcare.com"
										required
										type="email"
										value={email}
									/>
								</div>

								{/* Phone + Specialization */}
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docPhone">
											Phone Number *
										</label>
										<Input
											id="docPhone"
											onChange={(e) => setPhone(e.target.value)}
											placeholder="+1 (555) 000-0000"
											required
											type="tel"
											value={phone}
										/>
									</div>
									<div className="space-y-2">
										<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docSpec">
											Specialization
										</label>
										<Input
											id="docSpec"
											onChange={(e) => setSpecialization(e.target.value)}
											placeholder="e.g. Cardiologist"
											type="text"
											value={specialization}
										/>
									</div>
								</div>

								{/* Department */}
								<div className="space-y-2">
									<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docDept">
										Clinical Department *
									</label>
									<select
										className="flex h-12 w-full cursor-pointer items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
										id="docDept"
										onChange={(e) => setDepartment(e.target.value)}
										value={department}
									>
										<option value="general-care">General Care</option>
										<option value="cardiology">Cardiology</option>
										<option value="pediatrics">Pediatrics</option>
										<option value="diagnostics">Diagnostics</option>
										<option value="neurology">Neurology</option>
										<option value="orthopedics">Orthopedics</option>
										<option value="dermatology">Dermatology</option>
									</select>
								</div>

								{/* Status */}
								<div className="space-y-2">
									<label className="font-bold text-xs uppercase tracking-wider text-slate-500">
										Availability Status *
									</label>
									<div className="flex items-center gap-6">
										{(["active", "inactive"] as const).map((s) => (
											<label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700" key={s}>
												<input
													type="radio"
													name="doctor-status"
													value={s}
													checked={status === s}
													onChange={() => setStatus(s)}
													className="h-4 w-4 accent-primary"
												/>
												{s.charAt(0).toUpperCase() + s.slice(1)}
											</label>
										))}
									</div>
								</div>
							</>
						)}

						{/* ── Tab 2: Profile ── */}
						{activeTab === "profile" && (
							<>
								{/* Profile Image */}
								<div className="space-y-2">
									<label className="font-bold text-xs uppercase tracking-wider text-slate-500">
										Profile Image
									</label>
									
									{image ? (
										<div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
											<img
												alt="Profile Preview"
												className="h-20 w-20 rounded-2xl object-cover border border-slate-200 bg-white"
												src={image}
											/>
											<div className="space-y-1">
												<p className="text-sm font-semibold text-slate-700">Image Uploaded</p>
												<button
													className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
													onClick={() => setImage("")}
													type="button"
												>
													Remove Image
												</button>
											</div>
										</div>
									) : (
										<div className="relative group cursor-pointer border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 bg-slate-50/50 hover:bg-primary/5 flex flex-col items-center justify-center text-center gap-2">
											<input
												className="absolute inset-0 opacity-0 cursor-pointer"
												type="file"
												accept="image/*"
												onChange={async (e) => {
													const file = e.target.files?.[0];
													if (!file) return;
													
													setIsUploading(true);
													try {
														const res = await api.uploadImage(file);
														setImage(res.url);
													} catch (err: any) {
														alert(err.message || "Failed to upload image");
													} finally {
														setIsUploading(false);
													}
												}}
												disabled={isUploading}
											/>
											{isUploading ? (
												<div className="flex flex-col items-center gap-2">
													<Loader2 className="h-8 w-8 text-primary animate-spin" />
													<p className="text-xs font-bold text-slate-500">Uploading image...</p>
												</div>
											) : (
												<>
													<div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
														<UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
													</div>
													<div>
														<p className="text-xs font-bold text-slate-700">Drag & drop or click to upload</p>
														<p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG, WEBP or SVG (Max 10MB)</p>
													</div>
												</>
											)}
										</div>
									)}
								</div>

								{/* Experience + Success Rate */}
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docExp">
											Years of Experience
										</label>
										<Input
											id="docExp"
											onChange={(e) => setExperience(e.target.value)}
											placeholder="e.g. 15+ Years"
											type="text"
											value={experience}
										/>
									</div>
									<div className="space-y-2">
										<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docRate">
											Success Rate
										</label>
										<Input
											id="docRate"
											onChange={(e) => setSuccessRate(e.target.value)}
											placeholder="e.g. 98%"
											type="text"
											value={successRate}
										/>
									</div>
								</div>

								{/* About */}
								<div className="space-y-2">
									<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="docAbout">
										About / Bio
									</label>
									<textarea
										className="min-h-[130px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
										id="docAbout"
										onChange={(e) => setAbout(e.target.value)}
										placeholder="Write a short professional biography for this specialist..."
										value={about}
									/>
								</div>
							</>
						)}

						{/* ── Tab 3: Details ── */}
						{activeTab === "details" && (
							<>
								<div className="rounded-2xl bg-primary/5 border border-primary/10 px-5 py-4">
									<p className="text-xs font-bold text-primary">
										💡 Press <kbd className="rounded bg-primary/10 px-1.5 py-0.5">Enter</kbd> or click <strong>+</strong> to add each item. These appear on the doctor's profile page.
									</p>
								</div>

								<TagInput
									label="Key Achievements"
									placeholder="e.g. Published 30+ research papers"
									values={achievements}
									onChange={setAchievements}
								/>

								<TagInput
									label="Primary Skills"
									placeholder="e.g. Minimally Invasive Surgery"
									values={skills}
									onChange={setSkills}
								/>
							</>
						)}
					</div>

					{/* Footer — Tab nav + Save */}
					<div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-8 py-5 shrink-0">
						<div className="flex items-center gap-2">
							<Button
								disabled={!canGoBack}
								onClick={() => setActiveTab(TABS[tabIndex - 1].id)}
								size="sm"
								type="button"
								variant="outline"
							>
								<ChevronLeft className="h-4 w-4 mr-1" />
								Back
							</Button>
							<Button
								disabled={!canGoNext}
								onClick={() => setActiveTab(TABS[tabIndex + 1].id)}
								size="sm"
								type="button"
								variant="outline"
							>
								Next
								<ChevronRight className="h-4 w-4 ml-1" />
							</Button>
						</div>

						{/* Tab indicator dots */}
						<div className="flex items-center gap-1.5">
							{TABS.map((tab, i) => (
								<div
									className={`h-2 rounded-full transition-all ${
										tab.id === activeTab ? "w-6 bg-primary" : "w-2 bg-slate-300"
									}`}
									key={tab.id}
								/>
							))}
						</div>

						<div className="flex items-center gap-3">
							<Button onClick={onClose} type="button" variant="outline">
								Cancel
							</Button>
							<Button disabled={isSubmitting || isUploading} type="submit">
								{isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									doctor ? "Save Changes" : "Add Specialist"
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
