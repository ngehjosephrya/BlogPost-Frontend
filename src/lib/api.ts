// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

type RequestOptions = {
  method?:  string;
  body?:    string;
  headers?: Record<string, string>;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Send as Bearer token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // ← add this
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    credentials: "include", // ← keep this too for browsers that support cookies
    ...options,
  });

  if (res.status === 401) {
    const isAuthEndpoint = endpoint.startsWith("/auth/");
    if (!isAuthEndpoint) {
      // Clear everything and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject("Unauthenticated");
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}

export const api = {
  get:    <T>(url: string)                => request<T>(url),
  post:   <T>(url: string, body: unknown) => request<T>(url, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(url: string, body: unknown) => request<T>(url, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T>(url: string)               => request<T>(url, { method: "DELETE" }),
};