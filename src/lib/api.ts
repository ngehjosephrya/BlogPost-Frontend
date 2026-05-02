const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

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
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
    ...options,
  });

  if (res.status === 401) {
    const isAuthRoute = endpoint.includes("/auth/sign");

    if (!isAuthRoute) {
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
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
