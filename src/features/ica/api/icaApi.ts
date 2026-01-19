const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch<T>(
  url: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.token && { Authorization: `Bearer ${options.token}` }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error en la API");
  }

  return res.json() as Promise<T>;
}
