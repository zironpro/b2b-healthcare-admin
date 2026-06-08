import * as React from "react";
import { X, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface ServiceData {
	_id: string;
	title: string;
	description: string;
	icon: string;
	color?: string;
	image?: string;
	status: "active" | "inactive";
}

interface AddEditServiceModalProps {
	onClose: () => void;
	onSaveService: (serviceData: {
		title: string;
		description: string;
		icon: string;
		color: string;
		image: string;
		status: "active" | "inactive";
	}) => Promise<void>;
	service?: ServiceData | null;
}

const COMMON_ICONS = [
	{ name: "Activity", val: "Activity" },
	{ name: "Heart", val: "Heart" },
	{ name: "Brain", val: "Brain" },
	{ name: "Eye", val: "Eye" },
	{ name: "Pill", val: "Pill" },
	{ name: "Stethoscope", val: "Stethoscope" },
	{ name: "Shield", val: "Shield" },
	{ name: "Sparkles", val: "Sparkles" },
];

const COMMON_COLORS = [
	{ name: "Teal (Theme)", val: "text-primary" },
	{ name: "Blue", val: "text-blue-500" },
	{ name: "Emerald", val: "text-emerald-500" },
	{ name: "Indigo", val: "text-indigo-500" },
	{ name: "Purple", val: "text-purple-500" },
	{ name: "Rose", val: "text-rose-500" },
];

export function AddEditServiceModal({ onClose, onSaveService, service }: AddEditServiceModalProps) {
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [icon, setIcon] = React.useState("Activity");
	const [color, setColor] = React.useState("text-primary");
	const [image, setImage] = React.useState("");
	const [isUploading, setIsUploading] = React.useState(false);
	const [status, setStatus] = React.useState<"active" | "inactive">("active");
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		if (service) {
			setTitle(service.title);
			setDescription(service.description);
			setIcon(service.icon || "Activity");
			setColor(service.color || "text-primary");
			setImage(service.image || "");
			setStatus(service.status || "active");
		} else {
			setTitle("");
			setDescription("");
			setIcon("Activity");
			setColor("text-primary");
			setImage("");
			setStatus("active");
		}
	}, [service]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !description || !icon) {
			alert("Please fill in all required fields.");
			return;
		}

		setIsSubmitting(true);
		try {
			await onSaveService({ title, description, icon, color, image, status });
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
			<div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl animate-scale-up">
				<div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
					<h3 className="font-heading font-black text-xl text-slate-900">
						{service ? "Edit Medical Service" : "Add Medical Service"}
					</h3>
					<button
						className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
						onClick={onClose}
						type="button"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit}>
					{/* Title */}
					<div className="space-y-2">
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="serviceTitle">
							Service Title *
						</label>
						<Input
							id="serviceTitle"
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Cardiology & Vascular"
							required
							type="text"
							value={title}
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="serviceDesc">
							Description *
						</label>
						<textarea
							className="flex min-h-[80px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
							id="serviceDesc"
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe the medical services offered..."
							required
							value={description}
						/>
					</div>

					{/* Icon & Color Selection Grid */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="serviceIcon">
								Lucide Icon *
							</label>
							<select
								className="flex h-12 w-full cursor-pointer items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
								id="serviceIcon"
								onChange={(e) => setIcon(e.target.value)}
								value={icon}
							>
								{COMMON_ICONS.map((ico) => (
									<option key={ico.val} value={ico.val}>
										{ico.name}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
							<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="serviceColor">
								Theme Color
							</label>
							<select
								className="flex h-12 w-full cursor-pointer items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
								id="serviceColor"
								onChange={(e) => setColor(e.target.value)}
								value={color}
							>
								{COMMON_COLORS.map((col) => (
									<option key={col.val} value={col.val}>
										{col.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Service Image Upload */}
					<div className="space-y-2">
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Service Image (Optional)
						</label>
						
						{image ? (
							<div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
								<img
									alt="Service Preview"
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

					{/* Status Radio Buttons */}
					<div className="space-y-2">
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Service Availability Status *
						</label>
						<div className="flex items-center gap-6">
							<label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
								<input
									type="radio"
									name="service-status"
									value="active"
									checked={status === "active"}
									onChange={() => setStatus("active")}
									className="h-4 w-4 text-primary border-slate-300 focus:ring-primary/20 accent-primary"
								/>
								Active
							</label>
							<label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
								<input
									type="radio"
									name="service-status"
									value="inactive"
									checked={status === "inactive"}
									onChange={() => setStatus("inactive")}
									className="h-4 w-4 text-primary border-slate-300 focus:ring-primary/20 accent-primary"
								/>
								Inactive
							</label>
						</div>
					</div>

					{/* Submit Buttons */}
					<div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
						<Button
							onClick={onClose}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isSubmitting || isUploading}
							type="submit"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Save Service"
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
