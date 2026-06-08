import * as React from "react";
import { X, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface NewsData {
	_id: string;
	title: string;
	description: string;
	category: "News" | "Events";
	image?: string;
	date: string;
	status: "active" | "inactive";
}

interface AddEditNewsModalProps {
	onClose: () => void;
	onSaveNews: (newsData: {
		title: string;
		description: string;
		category: "News" | "Events";
		image: string;
		date: string;
		status: "active" | "inactive";
	}) => Promise<void>;
	news?: NewsData | null;
}

export function AddEditNewsModal({ onClose, onSaveNews, news }: AddEditNewsModalProps) {
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [category, setCategory] = React.useState<"News" | "Events">("News");
	const [image, setImage] = React.useState("");
	const [isUploading, setIsUploading] = React.useState(false);
	const [date, setDate] = React.useState("");
	const [status, setStatus] = React.useState<"active" | "inactive">("active");
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		if (news) {
			setTitle(news.title);
			setDescription(news.description);
			setCategory(news.category || "News");
			setImage(news.image || "");
			setDate(news.date || "");
			setStatus(news.status || "active");
		} else {
			setTitle("");
			setDescription("");
			setCategory("News");
			setImage("");
			// Default to today's date in YYYY-MM-DD format
			const today = new Date().toISOString().split("T")[0];
			setDate(today);
			setStatus("active");
		}
	}, [news]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !description || !category || !date) {
			alert("Please fill in all required fields.");
			return;
		}

		setIsSubmitting(true);
		try {
			await onSaveNews({ title, description, category, image, date, status });
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
						{news ? "Edit News / Event" : "Add News / Event"}
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
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="newsTitle">
							Title *
						</label>
						<Input
							id="newsTitle"
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. New Pediatric Wing Grand Opening"
							required
							type="text"
							value={title}
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="newsDesc">
							Description *
						</label>
						<textarea
							className="flex min-h-[80px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
							id="newsDesc"
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Details or content for the news/event article..."
							required
							value={description}
						/>
					</div>

					{/* Category & Date Grid */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="newsCategory">
								Category *
							</label>
							<select
								className="flex h-12 w-full cursor-pointer items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
								id="newsCategory"
								onChange={(e) => setCategory(e.target.value as "News" | "Events")}
								value={category}
							>
								<option value="News">News</option>
								<option value="Events">Event</option>
							</select>
						</div>

						<div className="space-y-2">
							<label className="font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="newsDate">
								Publish Date *
							</label>
							<Input
								id="newsDate"
								onChange={(e) => setDate(e.target.value)}
								required
								type="date"
								value={date}
							/>
						</div>
					</div>

					{/* Featured Image Upload */}
					<div className="space-y-2">
						<label className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Featured Image (Optional)
						</label>
						
						{image ? (
							<div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
								<img
									alt="News Preview"
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
							Publication Status *
						</label>
						<div className="flex items-center gap-6">
							<label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
								<input
									type="radio"
									name="news-status"
									value="active"
									checked={status === "active"}
									onChange={() => setStatus("active")}
									className="h-4 w-4 text-primary border-slate-300 focus:ring-primary/20 accent-primary"
								/>
								Active (Visible)
							</label>
							<label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
								<input
									type="radio"
									name="news-status"
									value="inactive"
									checked={status === "inactive"}
									onChange={() => setStatus("inactive")}
									className="h-4 w-4 text-primary border-slate-300 focus:ring-primary/20 accent-primary"
								/>
								Inactive (Draft)
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
								"Save Article"
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
