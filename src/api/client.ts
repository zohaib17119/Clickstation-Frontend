import type {
  AuthPayload,
  CloudR2Settings,
  CustomerRow,
  MePayload,
  Subscription,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  register(body: { email: string; password: string; name: string }) {
    return request<AuthPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  login(body: { email: string; password: string }) {
    return request<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  me(token: string) {
    return request<MePayload>("/me", { token });
  },
  requestReview(token: string, body: { plan?: Subscription["plan"] }) {
    return request<MePayload>("/me/subscription/request-review", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
  },
  downloadWindows(token: string) {
    return request<{
      downloadUrl: string;
      subscription: Subscription;
      canDownload: boolean;
      message: string;
    }>("/me/download/windows", {
      method: "POST",
      token,
      body: "{}",
    });
  },
  listCustomers(token: string) {
    return request<{ customers: CustomerRow[] }>("/admin/customers", { token });
  },
  getCloudSettings(token: string) {
    return request<{ cloud: CloudR2Settings }>("/admin/settings/cloud", { token });
  },
  putCloudSettings(
    token: string,
    body: Partial<CloudR2Settings> & { enabled: boolean; testConnection?: boolean }
  ) {
    return request<{ cloud: CloudR2Settings; test?: { ok: boolean; message?: string } }>(
      "/admin/settings/cloud",
      {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      }
    );
  },
  patchSubscription(
    token: string,
    customerId: string,
    body: {
      plan?: Subscription["plan"];
      status?: Subscription["status"];
      paymentStatus?: Subscription["paymentStatus"];
      endsAt?: string | null;
      notes?: string;
      extendDays?: number;
      revokeLicenses?: boolean;
    }
  ) {
    return request<{ user: CustomerRow["user"]; subscription: Subscription }>(
      `/admin/customers/${customerId}/subscription`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
      }
    );
  },
};
