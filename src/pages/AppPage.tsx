import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_URL as string | undefined;
const LOGO_SRC = import.meta.env.VITE_LOGO_URL ?? "/images/clickstation-logo.png";

function formatEndsAt(endsAt: string | null | undefined) {
  if (!endsAt) return "—";
  const d = new Date(endsAt);
  if (Number.isNaN(d.getTime())) return endsAt;
  return d.toLocaleString();
}

function daysLeft(endsAt: string | null | undefined) {
  if (!endsAt) return null;
  const ms = new Date(endsAt).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 864e5));
}

export function AppPage() {
  const { user, subscription, token, loading, refresh } = useAuth();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const [showActivateInfo, setShowActivateInfo] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  if (loading) {
    return <div className="page-center">Loading…</div>;
  }

  if (!user || !token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Sign in required</h1>
          <p className="muted">Open your Windows download center after signing in.</p>
          <div className="panel-actions">
            <Link to="/login" className="btn btn-primary">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-ghost">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const entitled = subscription?.canDownload === true;
  const left = daysLeft(subscription?.endsAt);
  const status = subscription?.status ?? "inactive";
  const payment = subscription?.paymentStatus ?? "unpaid";

  async function startDownload() {
    if (!token) return;
    setError("");
    setOk("");
    setBusy(true);
    try {
      const res = await api.downloadWindows(token);
      await refresh();
      setOk(
        res.message ||
          "7-day access granted. Download started — install, then Activate on this PC."
      );
      const a = document.createElement("a");
      a.href = res.downloadUrl;
      a.download = res.downloadUrl.includes(".zip")
        ? "ClickStation-Windows.zip"
        : "ClickStation-Setup.exe";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-page op-page">
      <div className="software-shell op-shell">
        <header className="op-hero">
          <div className="op-hero-copy">
            <div className="op-hero-brand">
              <img src={LOGO_SRC} alt="" className="op-hero-logo" />
              <p className="op-kicker">Operator dashboard</p>
            </div>
            <h1>Your ClickStation account</h1>
            <p className="op-hero-lead">
              Download the Windows Setup installer, install on the booth PC, then activate with this
              account so the license binds to that machine.
            </p>
          </div>
          <div className="op-hero-visual" aria-hidden="true">
            <img
              src="/images/dashboard-hero-laptop.png"
              alt=""
              className="op-hero-img"
            />
          </div>
        </header>

        {error && <p className="form-error">{error}</p>}
        {ok && <p className="form-ok">{ok}</p>}

        <div className="op-grid">
          <section className="op-card">
            <div className="op-card-head">
              <span className="op-card-icon op-card-icon-blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <div>
                <h2>Account Details</h2>
                <p>Signed in details and current entitlement.</p>
              </div>
            </div>

            <div className="op-meta">
              <div className="op-meta-item">
                <span className="op-meta-label">
                  <span className="op-dot op-dot-blue" /> Name
                </span>
                <strong>{user.name}</strong>
              </div>
              <div className="op-meta-item">
                <span className="op-meta-label">
                  <span className="op-dot op-dot-purple" /> Email
                </span>
                <strong>{user.email}</strong>
              </div>
              <div className="op-meta-item">
                <span className="op-meta-label">
                  <span className="op-dot op-dot-red" /> Status
                </span>
                <strong className="op-status-line">
                  <span className={`badge status-${status}`}>{status}</span>
                  <span className="small muted">/ {payment}</span>
                </strong>
              </div>
              <div className="op-meta-item">
                <span className="op-meta-label">
                  <span className="op-dot op-dot-green" /> Expires
                </span>
                <strong>
                  {formatEndsAt(subscription?.endsAt)}
                  {left !== null ? (
                    <span className="small muted"> ({left} day{left === 1 ? "" : "s"} left)</span>
                  ) : null}
                </strong>
              </div>
            </div>

            <div className="op-next">
              <div className="op-next-text">
                <span className="op-next-info" aria-hidden="true">
                  i
                </span>
                <p>
                  <strong>Next Step:</strong> Download the Windows Setup installer, install it on
                  the booth PC, then activate this account so the license binds to that machine.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary op-download-btn"
                disabled={busy}
                onClick={() => void startDownload()}
              >
                {busy ? "Preparing…" : "Download Setup"}
              </button>
            </div>

            {entitled && (
              <p className="muted small op-entitled-note">
                Access is active until {formatEndsAt(subscription?.endsAt)}. Admin can extend or end
                your subscription anytime.
              </p>
            )}

            {showActivateInfo && (
              <div className="op-license-note">
                <h3>How machine binding works</h3>
                <p>
                  The Setup installer is shared. Your <strong>license file</strong> is unique: signed
                  for your account + this PC’s fingerprint + expiry. Copying the license to another
                  PC fails. To move seats, activate again on the new PC (one active device per
                  account).
                </p>
              </div>
            )}
          </section>

          <aside className="op-card op-actions-card">
            <div className="op-card-head">
              <span className="op-card-icon op-card-icon-purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <div>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="op-actions">
              <button
                type="button"
                className="op-action"
                disabled={busy}
                onClick={() => void startDownload()}
              >
                <span className="op-action-icon op-action-blue" aria-hidden="true">↓</span>
                <span className="op-action-copy">
                  <strong>Download Windows Setup</strong>
                  <span>Get the installer for your booth PC.</span>
                </span>
                <span className="op-action-chevron" aria-hidden="true">›</span>
              </button>

              <button
                type="button"
                className="op-action"
                onClick={() => setShowActivateInfo((v) => !v)}
              >
                <span className="op-action-icon op-action-green" aria-hidden="true">🔑</span>
                <span className="op-action-copy">
                  <strong>Activate License</strong>
                  <span>Bind your account to the machine.</span>
                </span>
                <span className="op-action-chevron" aria-hidden="true">›</span>
              </button>

              {WHATSAPP ? (
                <a className="op-action" href={WHATSAPP} target="_blank" rel="noreferrer">
                  <span className="op-action-icon op-action-purple" aria-hidden="true">?</span>
                  <span className="op-action-copy">
                    <strong>Need Help?</strong>
                    <span>View installation guide or contact support.</span>
                  </span>
                  <span className="op-action-chevron" aria-hidden="true">›</span>
                </a>
              ) : (
                <div className="op-action op-action-static">
                  <span className="op-action-icon op-action-purple" aria-hidden="true">?</span>
                  <span className="op-action-copy">
                    <strong>Need Help?</strong>
                    <span>View installation guide or contact support.</span>
                  </span>
                </div>
              )}
            </div>

            <p className="op-secure muted small">
              Your account is secure. We use secure authentication to keep your data safe.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
