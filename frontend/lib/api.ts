import axios from "axios";
import type { AnalyzeImageResponse, AnalysisHistoryResponse } from "@/lib/types";
import { logout } from "@/lib/auth";

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);

export async function analyzeImage(file: File): Promise<AnalyzeImageResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<AnalyzeImageResponse>(
        "/api/v1/analyses/image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export async function getImageHistory(): Promise<AnalysisHistoryResponse> {
    const response = await api.get<AnalysisHistoryResponse>("/api/v1/analyses/image");
    return response.data;
}

export default api;