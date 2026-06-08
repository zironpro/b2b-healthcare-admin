const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path: string, options: RequestInit = {}) {
	const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
	
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers,
	});

	if (res.status === 401 || res.status === 403) {
		if (typeof window !== "undefined") {
			localStorage.removeItem("admin_token");
			localStorage.removeItem("admin_user");
			window.location.href = "/";
		}
		throw new Error("Session expired. Please log in again.");
	}

	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message || "An error occurred on the server.");
	}

	return data;
}

export const api = {
	login: async (body: any) => {
		const res = await fetch(`${BASE_URL}/admin/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.message || "Invalid credentials.");
		return data;
	},
	getStats: () => request("/admin/dashboard-stats"),
	getAppointments: () => request("/admin/appointments"),
	updateAppointmentStatus: (id: string, status: "confirmed" | "cancelled") =>
		request(`/admin/appointments/${id}`, {
			method: "PUT",
			body: JSON.stringify({ status }),
		}),
	getPatients: () => request("/admin/patients"),
	getDoctors: () => request("/admin/doctors"),
	createDoctor: (body: any) =>
		request("/admin/doctors", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	updateDoctor: (id: string, body: any) =>
		request(`/admin/doctors/${id}`, {
			method: "PUT",
			body: JSON.stringify(body),
		}),
	deleteDoctor: (id: string) =>
		request(`/admin/doctors/${id}`, {
			method: "DELETE",
		}),
	getServices: () => request("/admin/services"),
	createService: (body: any) =>
		request("/admin/services", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	updateService: (id: string, body: any) =>
		request(`/admin/services/${id}`, {
			method: "PUT",
			body: JSON.stringify(body),
		}),
	deleteService: (id: string) =>
		request(`/admin/services/${id}`, {
			method: "DELETE",
		}),
	getNews: () => request("/admin/news"),
	createNews: (body: any) =>
		request("/admin/news", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	updateNews: (id: string, body: any) =>
		request(`/admin/news/${id}`, {
			method: "PUT",
			body: JSON.stringify(body),
		}),
	deleteNews: (id: string) =>
		request(`/admin/news/${id}`, {
			method: "DELETE",
		}),
	uploadImage: async (file: File) => {
		const formData = new FormData();
		formData.append("image", file);
		const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
		
		const headers: Record<string, string> = {};
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
		
		const res = await fetch(`${BASE_URL}/admin/upload`, {
			method: "POST",
			headers,
			body: formData,
		});
		
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.message || "Upload failed");
		}
		return data;
	},
};
