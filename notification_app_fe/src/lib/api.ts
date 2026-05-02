export interface Notification {
  ID: string;
  Type: "Event" | "Result" | "Placement";
  Message: string;
  Timestamp: string;
}

export async function fetchNotifications(page: number = 1, limit: number = 20, type?: string): Promise<Notification[]> {
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  if (!token) {
    console.error("No access token provided");
    return [];
  }

  try {
    // Determine the base URL dynamically based on whether we're on the server or client
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/proxy/notifications`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (type && type !== "All") {
      url.searchParams.append("notification_type", type);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.notifications || [];
  } catch (err) {
    console.error("Fetch failed", err);
    return [];
  }
}
