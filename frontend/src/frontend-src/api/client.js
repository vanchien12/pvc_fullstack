import axios from "axios";

// Theory: Axios GET - thư viện HTTP mạnh hơn fetch
// - Tự động parse JSON
// - Interceptors: tự gắn token, xử lý lỗi tập trung
// - Hỗ trợ cancel request, timeout, progress

const API_BASE_URL = "http://localhost:8000/api/v1";

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây timeout
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: tự động gắn JWT token vào mọi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("shophub_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: xử lý lỗi tập trung
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail || "Đã có lỗi xảy ra, vui lòng thử lại.";
    return Promise.reject(new Error(message));
  }
);

export const apiClient = {
  get: (endpoint, params) => axiosInstance.get(endpoint, { params }),
  post: (endpoint, body) => axiosInstance.post(endpoint, body),
  put: (endpoint, body) => axiosInstance.put(endpoint, body),
  delete: (endpoint) => axiosInstance.delete(endpoint),
};
