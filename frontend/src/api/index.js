// frontend/src/api/index.js
const BASE_URL = "http://localhost:8000/api/v1";

export const api = {
  get: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};