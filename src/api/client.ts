import type {
  AuthPayload,
  CloudR2Settings,
  CustomerRow,
  FailedCameraRow,
  MePayload,
  Subscription,
  SubscriptionPlan,
  SupportedCameraRow,
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
  releaseLicense(token: string) {
    return request<{ ok: boolean; message: string }>("/me/license/release", {
      method: "POST",
      token,
      body: "{}",
    });
  },
  checkout(token: string, body: { planId?: string; planSlug?: string }) {
    return request<{ url: string; sessionId: string }>("/billing/checkout", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
  },
  billingPortal(token: string) {
    return request<{ url: string }>("/billing/portal", {
      method: "POST",
      token,
      body: "{}",
    });
  },
  cancelBilling(token: string) {
    return request<{ subscription: Subscription; message: string }>("/billing/cancel", {
      method: "POST",
      token,
      body: "{}",
    });
  },
  resumeBilling(token: string) {
    return request<{ subscription: Subscription; message: string }>("/billing/resume", {
      method: "POST",
      token,
      body: "{}",
    });
  },
  listInvoices(token: string) {
    return request<{
      invoices: Array<{
        id: string;
        number: string | null;
        status: string | null;
        amountPaid: number;
        currency: string;
        created: string;
        hostedInvoiceUrl: string | null;
        invoicePdf: string | null;
      }>;
    }>("/billing/invoices", { token });
  },
  listStripeEvents(token: string, limit = 50) {
    return request<{
      events: Array<{ id: string; type: string; receivedAt: string }>;
    }>(`/admin/stripe-events?limit=${limit}`, { token });
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
  listPlans() {
    return request<{ plans: SubscriptionPlan[] }>("/plans");
  },
  listAdminPlans(token: string) {
    return request<{ plans: SubscriptionPlan[] }>("/admin/plans", { token });
  },
  createPlan(
    token: string,
    body: {
      slug: string;
      title: string;
      description?: string;
      priceCents: number;
      currency?: string;
      durationDays: number;
      isActive?: boolean;
      sortOrder?: number;
      badge?: string;
      billingInterval?: SubscriptionPlan["billingInterval"];
      syncStripe?: boolean;
      promoPercentOff?: number | null;
      promoAmountOffCents?: number | null;
      promoStartsAt?: string | null;
      promoEndsAt?: string | null;
      promoActive?: boolean;
    }
  ) {
    return request<{ plan: SubscriptionPlan }>("/admin/plans", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
  },
  patchPlan(
    token: string,
    planId: string,
    body: Partial<{
      slug: string;
      title: string;
      description: string;
      priceCents: number;
      currency: string;
      durationDays: number;
      isActive: boolean;
      sortOrder: number;
      badge: string;
      billingInterval: SubscriptionPlan["billingInterval"];
      syncStripe: boolean;
      promoPercentOff: number | null;
      promoAmountOffCents: number | null;
      promoStartsAt: string | null;
      promoEndsAt: string | null;
      promoActive: boolean;
    }>
  ) {
    return request<{ plan: SubscriptionPlan }>(`/admin/plans/${planId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    });
  },
  syncPlanStripe(token: string, planId: string) {
    return request<{ plan: SubscriptionPlan }>(`/admin/plans/${planId}/sync-stripe`, {
      method: "POST",
      token,
      body: "{}",
    });
  },
  patchSubscription(
    token: string,
    customerId: string,
    body: {
      plan?: Subscription["plan"];
      planId?: string | null;
      status?: Subscription["status"];
      paymentStatus?: Subscription["paymentStatus"];
      endsAt?: string | null;
      notes?: string;
      extendDays?: number;
      revokeLicenses?: boolean;
      licenseChannel?: "standard" | "extended";
      grantType?: Subscription["grantType"];
      complimentaryDays?: number;
      complimentaryUntil?: string;
      cancelStripe?: boolean;
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
  listSupportedCameras(token: string) {
    return request<{ cameras: SupportedCameraRow[] }>("/admin/cameras/supported", { token });
  },
  listFailedCameras(token: string) {
    return request<{ failures: FailedCameraRow[] }>("/admin/cameras/failures", { token });
  },
  patchCamera(
    token: string,
    deviceKey: string,
    body: {
      status?: SupportedCameraRow["status"];
      notes?: string;
      supportedSinceVersion?: string;
    }
  ) {
    return request<{ camera: SupportedCameraRow }>(
      `/admin/cameras/${encodeURIComponent(deviceKey)}`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
      }
    );
  },
  notifyCamera(
    token: string,
    deviceKey: string,
    body: { supportedSinceVersion?: string; dryRun?: boolean } = {}
  ) {
    return request<{
      dryRun?: boolean;
      recipientCount?: number;
      recipients?: { email: string; name: string; lastFailAt: string }[];
      smtpConfigured?: boolean;
      sentCount?: number;
      failedCount?: number;
      sent?: string[];
      failed?: { email: string; error: string }[];
      brandModel?: string;
      version?: string;
    }>(`/admin/cameras/${encodeURIComponent(deviceKey)}/notify`, {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
  },
};
