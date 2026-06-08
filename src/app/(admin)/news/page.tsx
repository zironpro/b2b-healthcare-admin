"use client";

import * as React from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { NewsTable } from "./components/NewsTable";
import { AddEditNewsModal } from "./components/AddEditNewsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


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

export default function NewsPage() {
	const [newsItems, setNewsItems] = React.useState<NewsData[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchTerm, setSearchTerm] = React.useState<string>("");

	// Modals Open / Edit States
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [editingNews, setEditingNews] = React.useState<NewsData | null>(null);

	const fetchNews = async () => {
		setIsLoading(true);
		try {
			const newsData = await api.getNews();
			setNewsItems(newsData);
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchNews();
	}, []);

	const handleSaveNews = async (newsData: {
		title: string;
		description: string;
		category: "News" | "Events";
		image: string;
		date: string;
		status: "active" | "inactive";
	}) => {
		try {
			if (editingNews) {
				const res = await api.updateNews(editingNews._id, newsData);
				setNewsItems((prev) =>
					prev.map((n) => (n._id === editingNews._id ? res.news : n))
				);
			} else {
				const res = await api.createNews(newsData);
				setNewsItems((prev) => [res.news, ...prev]);
			}
			setIsModalOpen(false);
			setEditingNews(null);
		} catch (err: any) {
			alert(err.message || "Failed to save news/event.");
			throw err;
		}
	};

	const handleDeleteNews = async (id: string) => {
		if (!confirm("Are you sure you want to delete this news or event article?")) return;

		try {
			await api.deleteNews(id);
			setNewsItems((prev) => prev.filter((n) => n._id !== id));
		} catch (err: any) {
			alert(err.message || "Failed to delete article.");
		}
	};

	const filteredNews = React.useMemo(() => {
		return newsItems.filter((n) => {
			return (
				n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				n.category.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
	}, [newsItems, searchTerm]);

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
				{/* Search & Actions Bar */}
				<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
					<div className="relative flex-1 min-w-[245px]">
						<Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-slate-400" />
						<Input
							className="pl-11"
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search news & events..."
							type="text"
							value={searchTerm}
						/>
					</div>

					<Button
						onClick={() => {
							setEditingNews(null);
							setIsModalOpen(true);
						}}
					>
						<Plus className="h-4.5 w-4.5 mr-1.5" />
						<span>Add News/Event</span>
					</Button>
				</div>
			</div>

			{/* Data Table */}
			<div className="overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white shadow-sm">
				<NewsTable
					newsItems={filteredNews}
					onDeleteNews={handleDeleteNews}
					onEditNews={(n) => {
						setEditingNews(n);
						setIsModalOpen(true);
					}}
				/>
			</div>

			{/* Add/Edit Form Modal */}
			{isModalOpen && (
				<AddEditNewsModal
					news={editingNews}
					onClose={() => {
						setIsModalOpen(false);
						setEditingNews(null);
					}}
					onSaveNews={handleSaveNews}
				/>
			)}
		</div>
	);
}
