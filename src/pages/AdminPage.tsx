import { useEffect, useState } from "react";
import { api } from "../api/client";
import type {
  CloudR2Settings,
  CustomerRow,
  FailedCameraRow,
  Subscription,
  SupportedCameraRow,
} from "../api/types";
import { useAuth } from "../auth/AuthContext";

const EMPTY_CLOUD: CloudR2Settings = {
  enabled: false,
  endpoint: "",
  bucket: "",
  accessKeyId: "",
  secretAccessKey: "",
  secretAccessKeySet: false,
  publicBaseUrl: "",
  allowLocalQr: false,
  retentionHours: 48,
};

function formatEnds(endsAt: string | null | undefined) {
  if (!endsAt) return "—";
  const d = new Date(endsAt);
  return Number.isNaN(d.getTime()) ? endsAt : d.toLocaleString();
}

function accessLabel(subscription: Subscription | null | undefined, licenseActive?: boolean) {
  if (!subscription) return "No subscription";
  if (subscription.status === "active" && subscription.canDownload) {
    return licenseActive ? "ON — licensed PC" : "ON — waiting for PC activate";
  }
  return "OFF — blocked";
}

export function AdminPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [cloudDraft, setCloudDraft] = useState<CloudR2Settings>(EMPTY_CLOUD);
  const [secretAccessKeySet, setSecretAccessKeySet] = useState(false);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudLoadHint, setCloudLoadHint] = useState("");
  const [supportedCams, setSupportedCams] = useState<SupportedCameraRow[]>([]);
  const [failedCams, setFailedCams] = useState<FailedCameraRow[]>([]);
  const [camBusyKey, setCamBusyKey] = useState<string | null>(null);
  const [notifyVersion, setNotifyVersion] = useState("");

  async function load() {
    if (!token) return;
    try {
      const res = await api.listCustomers(token);
      setCustomers(res.customers);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    }
  }

  async function loadCameras() {
    if (!token) return;
    try {
      const [okRes, failRes] = await Promise.all([
        api.listSupportedCameras(token),
        api.listFailedCameras(token),
      ]);
      setSupportedCams(okRes.cameras);
      setFailedCams(failRes.failures);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load camera telemetry");
    }
  }

  async function loadCloud() {
    if (!token) return;
    try {
      const res = await api.getCloudSettings(token);
      setCloudDraft({
        ...res.cloud,
        secretAccessKey: "",
      });
      setSecretAccessKeySet(res.cloud.secretAccessKeySet);
      setCloudLoadHint("");
    } catch (err) {
      setCloudDraft(EMPTY_CLOUD);
      setSecretAccessKeySet(false);
      setCloudLoadHint(
        err instanceof Error
          ? `${err.message} — form still editable; restart backend + run db:migrate, then Save.`
          : "Cloud settings API unavailable — form still editable."
      );
    }
  }

  useEffect(() => {
    void load();
    void loadCloud();
    void loadCameras();
  }, [token]);

  async function saveCloud(testConnection = false) {
    if (!token) return;
    setCloudBusy(true);
    setError("");
    setOk("");
    try {
      const res = await api.putCloudSettings(token, {
        enabled: cloudDraft.enabled,
        endpoint: cloudDraft.endpoint,
        bucket: cloudDraft.bucket,
        accessKeyId: cloudDraft.accessKeyId,
        secretAccessKey: cloudDraft.secretAccessKey,
        publicBaseUrl: cloudDraft.publicBaseUrl,
        allowLocalQr: cloudDraft.allowLocalQr,
        retentionHours: cloudDraft.retentionHours,
        testConnection,
      });
      setCloudDraft({
        ...res.cloud,
        secretAccessKey: "",
      });
      setSecretAccessKeySet(res.cloud.secretAccessKeySet);
      setCloudLoadHint("");
      if (testConnection) {
        if (res.test?.ok) {
          setOk("Cloud R2 connection OK — secret is saved on the server (field stays blank for security).");
        } else {
          setError(res.test?.message ?? "Saved, but connection test failed.");
        }
      } else {
        setOk(
          res.cloud.secretAccessKeySet
            ? "R2 settings saved. Secret is stored on the server — leave the secret field blank next time unless you want to replace it."
            : "Cloud R2 settings saved."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cloud save failed");
    } finally {
      setCloudBusy(false);
    }
  }

  async function patch(
    customerId: string,
    body: {
      status?: Subscription["status"];
      paymentStatus?: Subscription["paymentStatus"];
      plan?: Subscription["plan"];
      endsAt?: string | null;
      extendDays?: number;
      revokeLicenses?: boolean;
    },
    successMsg?: string
  ) {
    if (!token) return;
    setBusyId(customerId);
    setError("");
    setOk("");
    try {
      await api.patchSubscription(token, customerId, body);
      await load();
      if (successMsg) setOk(successMsg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function markSupported(row: FailedCameraRow) {
    if (!token) return;
    setCamBusyKey(row.deviceKey);
    setError("");
    setOk("");
    try {
      await api.patchCamera(token, row.deviceKey, {
        status: "supported",
        supportedSinceVersion: notifyVersion.trim() || undefined,
      });
      await loadCameras();
      setOk(
        `Marked ${[row.manufacturer, row.model].filter(Boolean).join(" ") || row.deviceKey} as supported.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mark supported failed");
    } finally {
      setCamBusyKey(null);
    }
  }

  async function previewNotify(row: FailedCameraRow) {
    if (!token) return;
    setCamBusyKey(row.deviceKey);
    setError("");
    setOk("");
    try {
      const res = await api.notifyCamera(token, row.deviceKey, {
        supportedSinceVersion: notifyVersion.trim() || undefined,
        dryRun: true,
      });
      const emails = (res.recipients ?? []).map((r) => r.email).join(", ") || "none";
      setOk(
        `Would email ${res.recipientCount ?? 0} customer(s). SMTP configured: ${
          res.smtpConfigured ? "yes" : "no"
        }. Recipients: ${emails}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview notify failed");
    } finally {
      setCamBusyKey(null);
    }
  }

  async function sendNotify(row: FailedCameraRow) {
    if (!token) return;
    setCamBusyKey(row.deviceKey);
    setError("");
    setOk("");
    try {
      await api.patchCamera(token, row.deviceKey, {
        status: "supported",
        supportedSinceVersion: notifyVersion.trim() || undefined,
      });
      const res = await api.notifyCamera(token, row.deviceKey, {
        supportedSinceVersion: notifyVersion.trim() || undefined,
        dryRun: false,
      });
      await loadCameras();
      setOk(
        `Emailed ${res.sentCount ?? 0} customer(s) about ${res.brandModel ?? "camera"}` +
          (res.failedCount ? ` (${res.failedCount} failed)` : "")
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Notify failed");
    } finally {
      setCamBusyKey(null);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <p className="kicker">Admin</p>
        <h1>Customer access control</h1>
        <p className="muted">
          <strong>Turn OFF</strong> ends subscription and revokes device licenses. While online,
          the customer is blocked on the next <strong>Start Session</strong> (or mid-session
          watchdog). <strong>Turn ON</strong> restores paid access (+7 days); customer Activates
          again on PC if needed.
        </p>
      </header>
      {error && (
        <p className="form-error" style={{ width: "var(--shell)", margin: "0 auto 16px" }}>
          {error}
        </p>
      )}
      {ok && (
        <p className="form-ok" style={{ width: "var(--shell)", margin: "0 auto 16px" }}>
          {ok}
        </p>
      )}

      <section className="admin-cloud-panel software-shell">
        <div className="admin-cloud-head">
          <div>
            <p className="kicker">Platform cloud</p>
            <h2>Cloudflare R2 credentials</h2>
            <p className="muted">
              Paste your shared R2 bucket here once. All entitled booths upload guest photos to this
              bucket — customers never see these keys.
            </p>
          </div>
          <label className="cloud-toggle">
            <input
              type="checkbox"
              checked={cloudDraft.enabled}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, enabled: e.target.checked }))}
            />
            <span>Enable cloud uploads</span>
          </label>
        </div>

        {cloudLoadHint && <p className="cloud-load-hint">{cloudLoadHint}</p>}

        <div className="admin-cloud-grid">
          <label>
            Endpoint
            <input
              type="url"
              placeholder="https://ACCOUNT_ID.r2.cloudflarestorage.com (no /bucket)"
              value={cloudDraft.endpoint}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, endpoint: e.target.value }))}
            />
          </label>
          <label>
            Bucket name
            <input
              type="text"
              placeholder="photobooth-guest-photos"
              value={cloudDraft.bucket}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, bucket: e.target.value }))}
            />
          </label>
          <label>
            Access Key ID
            <input
              type="text"
              autoComplete="off"
              placeholder="32-character R2 access key"
              value={cloudDraft.accessKeyId}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, accessKeyId: e.target.value }))}
            />
          </label>
          <label>
            Secret Access Key
            <input
              type="password"
              autoComplete="new-password"
              placeholder={
                secretAccessKeySet
                  ? "•••••••• saved on server — leave blank to keep, or paste a new secret to replace"
                  : "Paste R2 Secret Access Key (shown only once in Cloudflare)"
              }
              value={cloudDraft.secretAccessKey}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, secretAccessKey: e.target.value }))}
            />
          </label>
          {secretAccessKeySet && !cloudDraft.secretAccessKey && (
            <p className="cloud-secret-saved admin-cloud-span">
              Secret is already saved on the server. Blank field is normal — not deleted.
            </p>
          )}
          <label className="admin-cloud-span">
            Public base URL
            <input
              type="url"
              placeholder="https://pub-xxxx.r2.dev"
              value={cloudDraft.publicBaseUrl}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, publicBaseUrl: e.target.value }))}
            />
          </label>
          <label>
            Cloud notice (hours)
            <input
              type="number"
              min={1}
              max={720}
              value={cloudDraft.retentionHours}
              disabled={cloudBusy}
              onChange={(e) =>
                setCloudDraft((d) => ({
                  ...d,
                  retentionHours: Math.min(720, Math.max(1, Number(e.target.value) || 48)),
                }))
              }
            />
          </label>
          <label className="cloud-toggle" style={{ alignSelf: "end", marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={cloudDraft.allowLocalQr}
              disabled={cloudBusy}
              onChange={(e) => setCloudDraft((d) => ({ ...d, allowLocalQr: e.target.checked }))}
            />
            <span>Allow local Wi‑Fi QR when cloud is unavailable</span>
          </label>
          <p className="muted small admin-cloud-span" style={{ margin: "0 0 4px" }}>
            Retention hours are shown under cloud QR codes. Set matching R2 lifecycle rules in
            Cloudflare if you want automatic deletion.
          </p>
        </div>

        <div className="panel-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={cloudBusy}
            onClick={() => void saveCloud(false)}
          >
            {cloudBusy ? "Saving…" : "Save R2 settings"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={cloudBusy}
            onClick={() => void saveCloud(true)}
          >
            Save &amp; test connection
          </button>
        </div>
      </section>

      <section className="admin-cloud-panel software-shell" style={{ marginTop: 28 }}>
        <div className="admin-cloud-head">
          <div>
            <p className="kicker">Camera compatibility</p>
            <h2>Successfully connected devices</h2>
            <p className="muted">
              Models that at least one booth connected successfully. Use this as your known-good
              list.
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => void loadCameras()}>
            Refresh cameras
          </button>
        </div>
        <div className="admin-table-wrap" style={{ margin: 0, boxShadow: "none" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Brand / model</th>
                <th>Kind</th>
                <th>Successes</th>
                <th>Last success</th>
                <th>Since version</th>
              </tr>
            </thead>
            <tbody>
              {supportedCams.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No successful camera connections reported yet.
                  </td>
                </tr>
              )}
              {supportedCams.map((c) => (
                <tr key={c.deviceKey}>
                  <td>
                    <div className="cell-strong">
                      {[c.manufacturer, c.model].filter(Boolean).join(" ") || c.deviceKey}
                    </div>
                    <div className="muted small">{c.deviceKey}</div>
                  </td>
                  <td className="small">{c.status}</td>
                  <td className="small">{c.successCount}</td>
                  <td className="small">{formatEnds(c.lastSuccessAt)}</td>
                  <td className="small">{c.supportedSinceVersion || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2>Failed connection attempts</h2>
          <p className="muted">
            Customers tried these models and never succeeded. Mark supported after you ship a fix,
            then notify them by email (requires SMTP on the API).
          </p>
          <label style={{ display: "block", maxWidth: 280, marginBottom: 12 }}>
            Notify version label
            <input
              type="text"
              placeholder="e.g. 1.4.0"
              value={notifyVersion}
              onChange={(e) => setNotifyVersion(e.target.value)}
            />
          </label>
          <div className="admin-table-wrap" style={{ margin: 0, boxShadow: "none" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Brand / model</th>
                  <th>Fails</th>
                  <th>Last error</th>
                  <th>Customers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {failedCams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="muted">
                      No unresolved camera failures.
                    </td>
                  </tr>
                )}
                {failedCams.map((f) => (
                  <tr key={f.deviceKey}>
                    <td>
                      <div className="cell-strong">
                        {[f.manufacturer, f.model].filter(Boolean).join(" ") || f.deviceKey}
                      </div>
                      <div className="muted small">
                        {f.kind || "—"} · {f.status}
                      </div>
                    </td>
                    <td className="small">{f.failCount}</td>
                    <td className="small">{f.lastError || "—"}</td>
                    <td className="small">
                      {f.users.length === 0
                        ? "—"
                        : f.users.map((u) => (
                            <div key={u.userId}>
                              {u.email}
                              <span className="muted"> ({formatEnds(u.lastFailAt)})</span>
                            </div>
                          ))}
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={camBusyKey === f.deviceKey}
                        onClick={() => void markSupported(f)}
                      >
                        Mark supported
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        disabled={camBusyKey === f.deviceKey}
                        onClick={() => void previewNotify(f)}
                      >
                        Preview notify
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={camBusyKey === f.deviceKey}
                        onClick={() => void sendNotify(f)}
                      >
                        Email customers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Access</th>
              <th>Plan / pay</th>
              <th>Sub expires</th>
              <th>Device license</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="muted">
                  No customers yet.
                </td>
              </tr>
            )}
            {customers.map(({ user, subscription, license }) => {
              const on = subscription?.status === "active" && subscription.canDownload;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="cell-strong">{user.name}</div>
                    <div className="muted small">{user.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${on ? "status-active" : "status-inactive"}`}>
                      {accessLabel(subscription, license?.active)}
                    </span>
                  </td>
                  <td>
                    <div className="small">
                      {subscription?.plan ?? "—"} / {subscription?.paymentStatus ?? "—"}
                    </div>
                    <select
                      value={subscription?.plan ?? "manual"}
                      disabled={busyId === user.id}
                      onChange={(e) =>
                        void patch(user.id, {
                          plan: e.target.value as Subscription["plan"],
                        })
                      }
                    >
                      <option value="manual">manual</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                    </select>
                  </td>
                  <td className="small">{formatEnds(subscription?.endsAt)}</td>
                  <td className="small">
                    {license ? (
                      <>
                        <div>{license.deviceName || "PC"}</div>
                        <div className="muted">
                          {license.active
                            ? `Active until ${formatEnds(license.expiresAt)}`
                            : license.revokedAt
                              ? `Revoked ${formatEnds(license.revokedAt)}`
                              : "Expired / inactive"}
                        </div>
                      </>
                    ) : (
                      <span className="muted">Not activated on a PC yet</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={busyId === user.id}
                      title="Enable subscription and give +7 days"
                      onClick={() =>
                        void patch(
                          user.id,
                          {
                            status: "active",
                            paymentStatus: "paid",
                            extendDays: 7,
                          },
                          "Access ON. Customer can Activate / use after restart if needed."
                        )
                      }
                    >
                      Turn ON
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={busyId === user.id}
                      onClick={() =>
                        void patch(user.id, { extendDays: 7 }, "Extended +7 days.")
                      }
                    >
                      +7 days
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={busyId === user.id}
                      title="End subscription and revoke all device licenses"
                      onClick={() =>
                        void patch(
                          user.id,
                          {
                            status: "inactive",
                            paymentStatus: "unpaid",
                            endsAt: new Date().toISOString(),
                            revokeLicenses: true,
                          },
                          "Access OFF — licenses revoked. Customer blocked on next Start Session (when online)."
                        )
                      }
                    >
                      Turn OFF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
