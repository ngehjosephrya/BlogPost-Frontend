// lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5500/api"; // ← Fixed: removed /v1 unless your backend uses it

type RequestOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: { 
      "Content-Type": "application/json", 
      ...options.headers 
    },
    credentials: "include", // ← CRITICAL: sends cookies
    ...options,
    body: options.body, // ← ensure body is properly passed
  });

  // Parse response once
  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: "Invalid response from server" };
  }

  // Handle 401 - but don't redirect for auth routes
  if (res.status === 401) {
    const isAuthRoute = 
      endpoint.includes("/auth/sign") || 
      endpoint.includes("/auth/me") ||
      endpoint === "/auth/signout";
    
    // Only redirect non-auth routes
    if (!isAuthRoute) {
      // Clear stored user data
      localStorage.removeItem("user");
      window.location.href = "/signin";
      return Promise.reject(new Error("Unauthenticated"));
    }
  }

  // Check if response is not ok
  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data as T;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};