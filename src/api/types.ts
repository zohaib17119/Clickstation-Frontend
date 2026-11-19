export type UserRole = "admin" | "customer";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
};

export type Subscription = {
  id: string;
  plan: "monthly" | "yearly" | "manual" | "event";
  planId?: string | null;
  status: "active" | "inactive" | "unpaid" | "past_due";
  paymentStatus: "paid" | "unpaid" | "complimentary";
  startsAt: string | null;
  endsAt: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  grantType?: "paid" | "complimentary_timed" | "lifetime";
  notes: string;
  updatedAt: string;
  /** standard = 72h desktop grace; extended = 365d private Setup */
  licenseChannel?: "standard" | "extended";
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  hasStripeBilling?: boolean;
  canDownload: boolean;
  accessUntil?: string | null;
};

export type BillingInterval = "month" | "year" | "one_time";

export type SubscriptionPlan = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  effectivePriceCents?: number;
  currency: string;
  durationDays: number;
  isActive: boolean;
  sortOrder: number;
  badge: string;
  billingInterval?: BillingInterval;
  stripePriceId?: string | null;
  promoActive?: boolean;
  promoPercentOff?: number | null;
  promoAmountOffCents?: number | null;
  promoStartsAt?: string | null;
  promoEndsAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
  subscription: Subscription | null;
};

export type MePayload = {
  user: User;
  subscription: Subscription | null;
  license?: {
    fingerprint: string;
    deviceName: string;
    expiresAt: string;
    issuedAt: string;
    active: boolean;
  } | null;
};

export type CloudR2Settings = {
  enabled: boolean;
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  secretAccessKeySet: boolean;
  publicBaseUrl: string;
  allowLocalQr: boolean;
  retentionHours: number;
};

export type CustomerRow = {
  user: User;
  subscription: Subscription | null;
  license?: {
    fingerprint: string;
    deviceName: string;
    expiresAt: string | null;
    revokedAt: string | null;
    issuedAt: string | null;
    active: boolean;
  } | null;
};

export type CameraCompatStatus = "unknown" | "supported" | "unsupported" | "in_progress";

export type SupportedCameraRow = {
  deviceKey: string;
  manufacturer: string;
  model: string;
  status: CameraCompatStatus;
  notes: string;
  supportedSinceVersion: string;
  updatedAt: string;
  successCount: number;
  lastSuccessAt: string | null;
};

export type FailedCameraUser = {
  userId: string;
  email: string;
  name: string;
  lastFailAt: string;
};

export type FailedCameraRow = {
  deviceKey: string;
  manufacturer: string;
  model: string;
  kind: string;
  failCount: number;
  lastError: string;
  lastFailAt: string;
  status: CameraCompatStatus;
  notes: string;
  supportedSinceVersion: string;
  users: FailedCameraUser[];
};
