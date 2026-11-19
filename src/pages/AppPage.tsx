import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { Subscription } from "../api/types";
import { useAuth } from "../auth/AuthContext";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_URL as string | undefined;
const LOGO_SRC = import.meta.env.VITE_LOGO_URL ?? "/images/clickstation-logo.png";
const PORTAL_URL =
  (import.meta.env.VITE_PORTAL_URL as string | undefined) ??
  (typeof window !== "undefined" ? window.location.origin : "");

function formatEndsAt(endsAt: string | null | undefined) {
  if (!endsAt) return "Lifetime";
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
  const [params, setParams] = useSearchParams();
  const interestedPlan = (params.get("plan") ?? "").trim().toLowerCase();
  const billingFlag = (params.get("billing") ?? "").trim().toLowerCase();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const [showActivateInfo, setShowActivateInfo] = useState(false);
  const [license, setLicense] = useState<{
    fingerprint: string;
    deviceName: string;
    expiresAt: string;
    issuedAt: string;
    active: boolean;
  } | null>(null);

  const whatsappHref = useMemo(() => {
    if (!WHATSAPP) return null;
    if (!interestedPlan) return WHATSAPP;
    const sep = WHATSAPP.includes("?") ? "&" : "?";
    const text = encodeURIComponent(
      `Hi ClickStation — I need help with the “${interestedPlan}” plan / payment.`
    );
    return `${WHATSAPP}${sep}text=${text}`;
  }, [interestedPlan]);

  useEffect(() => {
    void (async () => {
      await refresh();
      if (!token) return;
      try {
        const me = await api.me(token);
        setLicense(me.license ?? null);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    if (billingFlag === "success") {
      setOk("Payment received. Your access should be active shortly — refresh if needed.");
      const next = new URLSearchParams(params);
      next.delete("billing");
      setParams(next, { replace: true });
      void refresh();
    }
  }, [billingFlag]);

  // Auto-checkout when /app?plan= and not entitled (after auth load).
  useEffect(() => {
    if (loading || !token || !user || !interestedPlan) return;
    if (subscription?.canDownload) return;
    if (subscription?.status === "past_due") return;
    const key = `auto_checkout_${interestedPlan}`;
    if (sessionStorage.getItem(key) === "1") return;
    sessionStorage.setItem(key, "1");
    let cancelled = false;
    void (async () => {
      setBusy(true);
      setError("");
      try {
        const res = await api.checkout(token, { planSlug: interestedPlan });
        if (cancelled) return;
        if (!res.url) throw new Error("Checkout did not return a URL");
        window.location.href = res.url;
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Checkout failed";
        setError(msg);
        if (/already have an active Stripe subscription/i.test(msg)) {
          try {
            const portal = await api.billingPortal(token);
            window.location.href = portal.url;
            return;
          } catch {
            /* keep error */
          }
        }
        try {
          await api.requestReview(token, {
            plan: interestedPlan as Subscription["plan"],
          });
          setOk("We logged a review request after checkout failed.");
        } catch {
          /* ignore */
        }
        setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, token, user, interestedPlan, subscription?.canDownload, subscription?.status]);

  if (loading) {
    return <div className="page-center">Loading…</div>;
  }

  if (!user || !token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <img className="auth-card-logo" src={LOGO_SRC} alt="ClickStation" />
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
  const accessUntil = subscription?.accessUntil ?? subscription?.currentPeriodEnd ?? subscription?.endsAt;
  const left = daysLeft(accessUntil);
  const status = subscription?.status ?? "inactive";
  const payment = subscription?.paymentStatus ?? "unpaid";
  const isLifetime = subscription?.grantType === "lifetime";
  const cancelScheduled = Boolean(subscription?.cancelAtPeriodEnd);

  async function startDownload() {
    if (!token) return;
    setError("");
    setOk("");
    setBusy(true);
    try {
      const res = await api.downloadWindows(token);
      await refresh();
      setOk(res.message || "Download ready. Install, then Activate on the booth PC.");
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

  async function startCheckout(planSlug?: string) {
    if (!token) return;
    setError("");
    setOk("");
    setBusy(true);
    try {
      const res = await api.checkout(token, planSlug ? { planSlug } : interestedPlan ? { planSlug: interestedPlan } : {});
      if (!res.url) throw new Error("Checkout did not return a URL");
      window.location.href = res.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      setError(msg);
      // Upgrade / dual-billing guidance: open Customer Portal when already subscribed.
      if (/already have an active Stripe subscription/i.test(msg)) {
        try {
          const portal = await api.billingPortal(token);
          setOk("Opening billing portal to manage your existing plan…");
          window.location.href = portal.url;
          return;
        } catch {
          /* fall through to request-review / WhatsApp */
        }
      }
      // Payment-fail fallback: request-review note + WhatsApp.
      try {
        await api.requestReview(token, {
          plan: (planSlug || interestedPlan || "manual") as "monthly" | "yearly" | "manual" | "event",
        });
        setOk(
          "We logged a review request. Use WhatsApp or Manage billing if payment failed — an admin can also grant access."
        );
      } catch {
        /* ignore */
      }
      setBusy(false);
    }
  }

  async function openPortal() {
    if (!token) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.billingPortal(token);
      window.location.href = res.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal");
      setBusy(false);
    }
  }

  async function cancelRenewal() {
    if (!token) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.cancelBilling(token);
      await refresh();
      setOk(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setBusy(false);
    }
  }

  async function resumeRenewal() {
    if (!token) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.resumeBilling(token);
      await refresh();
      setOk(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resume failed");
    } finally {
      setBusy(false);
    }
  }

  async function releaseSeat() {
    if (!token) return;
    if (!window.confirm("Release this PC seat? You will need to Activate again on the next booth PC.")) {
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await api.releaseLicense(token);
      const me = await api.me(token);
      setLicense(me.license ?? null);
      setOk(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not release seat");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dash">
      <section className="dash-hero">
        <div className="software-shell dash-hero-grid">
          <div className="dash-hero-copy animate-rise">
            <img src={LOGO_SRC} alt="ClickStation" className="dash-hero-logo" />
            <h1>Booth software for your account</h1>
            <p className="dash-hero-lead">
              Download the Windows Setup, install on the booth PC, then activate with this account
              so the license binds to that machine.
            </p>
            <div className="dash-status-row">
              <span className={`badge status-${status} status-chip`}>{status}</span>
              <span className="dash-status-meta">{payment}</span>
              {isLifetime ? (
                <span className="dash-status-meta">Lifetime</span>
              ) : left !== null ? (
                <span className="dash-status-meta">
                  {left} day{left === 1 ? "" : "s"} left
                </span>
              ) : null}
              {cancelScheduled && <span className="dash-status-meta">Cancels at period end</span>}
            </div>
          </div>
          <div className="dash-hero-visual animate-rise-delay" aria-hidden="true">
            <img
              src="/images/clickstation-interface-light.webp"
              alt=""
              className="dash-hero-img"
            />
          </div>
        </div>
      </section>

      <div className="software-shell dash-body">
        <div className="dash-identity animate-rise">
          <div>
            <span className="dash-identity-label">Signed in as</span>
            <strong>{user.name}</strong>
            <span className="muted">{user.email}</span>
          </div>
          <div className="dash-identity-expiry">
            <span className="dash-identity-label">
              {isLifetime ? "Access" : "Access ends"}
            </span>
            <strong>{isLifetime ? "Lifetime" : formatEndsAt(accessUntil)}</strong>
            {subscription?.plan ? (
              <span className="muted small" style={{ display: "block", marginTop: 4 }}>
                Plan: {subscription.plan}
                {subscription.stripeSubscriptionId ? " · Stripe" : ""}
              </span>
            ) : null}
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {ok && <p className="form-ok">{ok}</p>}

        {status === "past_due" && (
          <section className="dash-cta animate-rise" style={{ marginBottom: 20 }}>
            <div className="dash-cta-copy">
              <h2>Payment past due</h2>
              <p>
                Update your payment method to restore full access. You may still have a short access
                window until the period ends — use Manage billing to fix the card.
              </p>
            </div>
            <div className="panel-actions" style={{ flexWrap: "wrap" }}>
              {subscription?.hasStripeBilling ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  disabled={busy}
                  onClick={() => void openPortal()}
                >
                  {busy ? "Opening…" : "Fix billing"}
                </button>
              ) : null}
              {whatsappHref ? (
                <a href={whatsappHref} className="btn btn-ghost" target="_blank" rel="noreferrer">
                  WhatsApp help
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={busy}
                  onClick={() =>
                    void (async () => {
                      if (!token) return;
                      setBusy(true);
                      try {
                        await api.requestReview(token, { plan: subscription?.plan });
                        setOk("Review requested — an admin will follow up.");
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Request failed");
                      } finally {
                        setBusy(false);
                      }
                    })()
                  }
                >
                  Request review
                </button>
              )}
            </div>
          </section>
        )}

        {!entitled && status !== "past_due" && (
          <section className="dash-cta animate-rise" style={{ marginBottom: 20 }}>
            <div className="dash-cta-copy">
              <h2>Subscribe to download</h2>
              <p>
                {interestedPlan
                  ? `Continue with the “${interestedPlan}” plan via secure Stripe Checkout.`
                  : "Choose a plan on Pricing, or continue checkout if you already picked one."}
              </p>
            </div>
            <div className="panel-actions" style={{ flexWrap: "wrap" }}>
              {interestedPlan ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  disabled={busy}
                  onClick={() => void startCheckout(interestedPlan)}
                >
                  {busy ? "Opening…" : `Buy ${interestedPlan}`}
                </button>
              ) : null}
              <Link to="/pricing" className="btn btn-ghost btn-lg">
                View pricing
              </Link>
              {whatsappHref ? (
                <a href={whatsappHref} className="btn btn-ghost" target="_blank" rel="noreferrer">
                  WhatsApp help
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={busy}
                  onClick={() =>
                    void (async () => {
                      if (!token) return;
                      setBusy(true);
                      try {
                        await api.requestReview(token, {
                          plan: (interestedPlan || "manual") as Subscription["plan"],
                        });
                        setOk("Review requested — use Pricing checkout or wait for admin.");
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Request failed");
                      } finally {
                        setBusy(false);
                      }
                    })()
                  }
                >
                  Request review
                </button>
              )}
            </div>
          </section>
        )}

        {entitled && (
          <section className="dash-cta animate-rise" style={{ marginBottom: 20 }}>
            <div className="dash-cta-copy">
              <h2>Billing</h2>
              <p>
                {cancelScheduled
                  ? `Renewal is cancelled. You keep access until ${formatEndsAt(accessUntil)}.`
                  : isLifetime
                    ? "Complimentary lifetime access — no renewal required."
                    : subscription?.stripeSubscriptionId
                      ? "Manage payment method, invoices, or cancel renewal at period end."
                      : "Access is active. Stripe billing controls appear when you subscribe online."}
              </p>
            </div>
            <div className="panel-actions" style={{ flexWrap: "wrap" }}>
              {subscription?.hasStripeBilling ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={busy}
                  onClick={() => void openPortal()}
                >
                  Manage billing
                </button>
              ) : null}
              {subscription?.stripeSubscriptionId && !cancelScheduled ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={busy}
                  onClick={() => void cancelRenewal()}
                >
                  Cancel renewal
                </button>
              ) : null}
              {subscription?.stripeSubscriptionId && cancelScheduled ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() => void resumeRenewal()}
                >
                  Resume renewal
                </button>
              ) : null}
              <Link to="/pricing" className="btn btn-ghost">
                Change plan
              </Link>
            </div>
          </section>
        )}

        <section className="dash-cta animate-rise">
          <div className="dash-cta-copy">
            <h2>Download Windows Setup</h2>
            <p>
              One installer for your booth PC. After install, open ClickStation and activate with
              this account.
            </p>
            {entitled && (
              <p className="muted small">
                {isLifetime
                  ? "Lifetime access is active."
                  : `Access is active until ${formatEndsAt(accessUntil)}.`}
              </p>
            )}
            {!entitled && (
              <p className="muted small">
                Download unlocks after an active paid or complimentary subscription.
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg dash-cta-btn"
            disabled={busy || !entitled}
            onClick={() => void startDownload()}
            title={entitled ? "Download Setup" : "Active subscription required"}
          >
            {busy ? "Preparing…" : entitled ? "Download Setup" : "Download locked"}
          </button>
        </section>

        <section className="dash-steps" style={{ marginTop: 28 }}>
          <h2>Bound device</h2>
          {license ? (
            <div className="dash-identity" style={{ marginTop: 12 }}>
              <div>
                <span className="dash-identity-label">Booth PC</span>
                <strong>{license.deviceName || "PC"}</strong>
                <span className="muted small">
                  {license.active
                    ? `Active until ${formatEndsAt(license.expiresAt)}`
                    : "Inactive / expired"}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy}
                onClick={() => void releaseSeat()}
              >
                Release seat
              </button>
            </div>
          ) : (
            <p className="muted">No PC activated yet. Install Setup, then Activate in the app.</p>
          )}
        </section>

        <section className="dash-steps">
          <h2>Get running in three steps</h2>
          <ol className="dash-steps-list">
            <li>
              <span className="dash-step-num">01</span>
              <div>
                <strong>Install</strong>
                <p>Run the Setup EXE on the booth Windows PC.</p>
              </div>
            </li>
            <li>
              <span className="dash-step-num">02</span>
              <div>
                <strong>Activate</strong>
                <p>Sign in inside the app so the license binds to that machine.</p>
              </div>
            </li>
            <li>
              <span className="dash-step-num">03</span>
              <div>
                <strong>Run booth</strong>
                <p>Connect camera, pick a template, start your guest session.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="dash-support">
          <button
            type="button"
            className="dash-support-toggle"
            onClick={() => setShowActivateInfo((v) => !v)}
            aria-expanded={showActivateInfo}
          >
            <strong>How machine binding works</strong>
            <span>{showActivateInfo ? "Hide" : "Show"}</span>
          </button>
          {showActivateInfo && (
            <div className="dash-support-panel">
              <p>
                The Setup installer is shared. Your <strong>license file</strong> is unique: signed
                for your account + this PC’s fingerprint + expiry. Copying the license to another PC
                fails. To move seats, use Release seat here or activate again on the new PC (one
                active device per account). Renew at {PORTAL_URL || "the portal"} when access ends.
              </p>
            </div>
          )}

          {whatsappHref ? (
            <a className="dash-help-link" href={whatsappHref} target="_blank" rel="noreferrer">
              <strong>Need help?</strong>
              <span>
                {interestedPlan
                  ? `Chat on WhatsApp about the ${interestedPlan} plan`
                  : "Chat with support on WhatsApp"}
              </span>
            </a>
          ) : (
            <div className="dash-help-link dash-help-static">
              <strong>Need help?</strong>
              <span>Contact your ClickStation administrator.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
