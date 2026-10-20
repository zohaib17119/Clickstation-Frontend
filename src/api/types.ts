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
  plan: "monthly" | "yearly" | "manual";
  status: "active" | "inactive" | "unpaid";
  paymentStatus: "paid" | "unpaid" | "complimentary";
  startsAt: string | null;
  endsAt: string | null;
  notes: string;
  updatedAt: string;
  canDownload: boolean;
};

export type AuthPayload = {
  token: string;
  user: User;
  subscription: Subscription | null;
};

export type MePayload = {
  user: User;
  subscription: Subscription | null;
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
