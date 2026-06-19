// Base URL của backend FastAPI
const API_BASE_URL = "http://localhost:8000/api/v1";

// Hàm gọi API chung, tự gắn JWT token nếu có trong localStorage
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("shophub_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Cố gắng parse JSON, nếu rỗng thì trả null
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || "Đã có lỗi xảy ra, vui lòng thử lại.";
    throw new Error(message);
  }

  return data;
}

export const apiClient = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
