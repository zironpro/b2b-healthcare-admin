import * as React from "react";
import { Trash2, Edit2, Calendar, Newspaper, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsData {
	_id: string;
	title: string;
	description: string;
	category: "News" | "Events";
	image?: string;
	date: string;
	status: "active" | "inactive";
	createdAt?: string;
}

interface NewsTableProps {
	newsItems: NewsData[];
	onDeleteNews: (id: string) => void;
	onEditNews: (news: NewsData) => void;
}

export function NewsTable({ newsItems, onDeleteNews, onEditNews }: NewsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b border-slate-100 bg-slate-50/70 font-heading font-black text-xs uppercase tracking-wider text-slate-400">
						<th className="py-4.5 px-6">Title &amp; Category</th>
						<th className="py-4.5 px-6">Publish Date</th>
						<th className="py-4.5 px-6">Description Content</th>
						<th className="py-4.5 px-6">Image URL</th>
						<th className="py-4.5 px-6">Status</th>
						<th className="py-4.5 px-6 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-600">
					{newsItems.length === 0 ? (
						<tr>
							<td className="py-12 text-center text-slate-400 font-bold" colSpan={6}>
								No news or event articles found. Click &quot;Add News/Event&quot; to publish one.
							</td>
						</tr>
					) : (
						newsItems.map((item) => (
							<tr className="transition-colors hover:bg-slate-50/30" key={item._id}>
								<td className="py-4.5 px-6">
									<div className="flex items-center gap-3">
										<div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
											item.category === "Events"
												? "bg-purple-50 text-purple-600"
												: "bg-blue-50 text-blue-600"
										}`}>
											{item.category === "Events" ? (
												<Award className="h-4 w-4" />
											) : (
												<Newspaper className="h-4 w-4" />
											)}
										</div>
										<div>
											<span className="font-bold text-slate-900 block leading-tight">{item.title}</span>
											<span className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full mt-1 ${
												item.category === "Events"
													? "bg-purple-100/60 text-purple-700"
													: "bg-blue-100/60 text-blue-700"
											}`}>
												{item.category}
											</span>
										</div>
									</div>
								</td>
								<td className="py-4.5 px-6 font-bold text-slate-800">
									<div className="flex items-center gap-1.5 text-xs text-slate-600">
										<Calendar className="h-3.5 w-3.5 text-slate-400" />
										{item.date}
									</div>
								</td>
								<td className="py-4.5 px-6 max-w-xs">
									<div className="truncate text-slate-600 font-semibold" title={item.description}>
										{item.description}
									</div>
								</td>
								<td className="py-4.5 px-6 max-w-xs">
									{item.image ? (
										<div className="truncate text-xs font-semibold text-slate-400" title={item.image}>
											{item.image}
										</div>
									) : (
										<span className="italic text-slate-400 text-xs">None</span>
									)}
								</td>
								<td className="py-4.5 px-6">
									<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
										item.status === "active"
											? "bg-emerald-50 text-emerald-700 border border-emerald-200"
											: "bg-slate-50 text-slate-500 border border-slate-200"
									}`}>
										<span className={`h-1.5 w-1.5 rounded-full ${item.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
										{item.status === "active" ? "Active" : "Inactive"}
									</span>
								</td>
								<td className="py-4.5 px-6 text-right">
									<div className="flex items-center justify-end gap-2">
										<Button
											onClick={() => onEditNews(item)}
											size="sm"
											title="Edit News / Event"
											variant="outline"
										>
											<Edit2 className="h-4 w-4" />
										</Button>
										<Button
											onClick={() => onDeleteNews(item._id)}
											size="sm"
											title="Delete News / Event"
											variant="destructive"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
