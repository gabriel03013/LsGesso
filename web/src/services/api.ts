type FetchOptions = RequestInit;

export async function api<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error ?? new Error("Request failed");
  }

  return res.json();
}
