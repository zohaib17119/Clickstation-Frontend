import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { SubscriptionPlan } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { formatBillingError, formatDuration, formatMoney } from "../lib/format";
import { ConversionBand, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

export function PricingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.listPlans();
        if (!cancelled) setPlans(res.plans);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load plans");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("billing") === "cancelled") {
      setError("Checkout cancelled. You can try again anytime.");
    }
  }, [searchParams]);

  async function buy(plan: SubscriptionPlan) {
    if (!user || !token) {
      navigate(`/login?plan=${encodeURIComponent(plan.slug)}`);
      return;
    }
    setBusySlug(plan.slug);
    setError("");
    try {
      const res = await api.checkout(token, { planId: plan.id, planSlug: plan.slug });
      if (!res.url) throw new Error("Checkout unavailable");
      window.location.href = res.url;
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      setError(formatBillingError(err, "Checkout failed"));
      if (/already have an active Stripe subscription/i.test(raw)) {
        try {
          const portal = await api.billingPortal(token);
          window.location.href = portal.url;
          return;
        } catch {
          /* keep error */
        }
      }
      setBusySlug(null);
    }
  }

  return (
    <div className="mkt">
      <Seo
        title="ClickStation plan options"
        description="Subscribe to ClickStation Monthly, Yearly, or Event plans. Stripe Checkout for secure payment, then download and activate on your booth PC."
        path="/pricing"
      />
      <section className="mkt-page-hero">
        <div className="software-shell animate-rise">
          <p className="kicker">Pricing</p>
          <h1>Simple plans. Full booth software.</h1>
          <p className="lead">
            Subscribe online with Stripe. Monthly and Yearly renew automatically; Event is a
            one-time 90-day purchase. Download unlocks after payment.
          </p>
        </div>
      </section>

      <section className="mkt-section">
        <div className="software-shell">
          {loading && (
            <div className="pricing-grid">
              {[0, 1, 2].map((i) => (
                <div key={i} className="pricing-card pricing-skeleton" />
              ))}
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          {!loading && !error && plans.length === 0 && (
            <p className="muted">No active plans yet. Check back soon or contact support.</p>
          )}
          {!loading && plans.length > 0 && (
            <div className="pricing-grid">
              {plans.map((plan) => {
                const featured = Boolean(plan.badge);
                const showPromo =
                  plan.promoActive &&
                  plan.effectivePriceCents != null &&
                  plan.effectivePriceCents < plan.priceCents;
                const ctaLabel =
                  plan.billingInterval === "one_time"
                    ? busySlug === plan.slug
                      ? "Opening…"
                      : "Buy Event"
                    : busySlug === plan.slug
                      ? "Opening…"
                      : user
                        ? "Subscribe"
                        : "Sign in to subscribe";
                return (
                  <article
                    key={plan.id}
                    className={`pricing-card${featured ? " pricing-card-featured" : ""}`}
                  >
                    {plan.badge ? <span className="pricing-badge">{plan.badge}</span> : null}
                    <h2>{plan.title}</h2>
                    {showPromo ? (
                      <p className="pricing-price">
                        <span style={{ textDecoration: "line-through", opacity: 0.55, marginRight: 8 }}>
                          {formatMoney(plan.priceCents, plan.currency)}
                        </span>
                        {formatMoney(plan.effectivePriceCents!, plan.currency)}
                      </p>
                    ) : (
                      <p className="pricing-price">{formatMoney(plan.priceCents, plan.currency)}</p>
                    )}
                    <p className="pricing-period">
                      {formatDuration(plan.durationDays)} access
                      {plan.billingInterval === "month"
                        ? " · renews monthly"
                        : plan.billingInterval === "year"
                          ? " · renews yearly"
                          : " · one-time"}
                    </p>
                    <p className="pricing-desc">{plan.description}</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      disabled={busySlug === plan.slug}
                      onClick={() => void buy(plan)}
                    >
                      {ctaLabel}
                    </button>
                    {!user ? (
                      <p className="muted small" style={{ marginTop: 8 }}>
                        Or{" "}
                        <Link to={`/register?plan=${encodeURIComponent(plan.slug)}`}>
                          create an account
                        </Link>
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          <div className="pricing-footnote">
            <p className="muted">
              Cancel Monthly/Yearly anytime — you keep access until the current period ends. One
              active booth PC per account. Extended offline builds are not sold here.
            </p>
            <Link to="/downloads">Download &amp; activation steps</Link>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="software-shell pricing-faq-grid">
          <SectionHeading eyebrow="Pricing FAQs" title="How billing works.">
            <p>Secure Stripe Checkout, portal renewals, and admin-managed complimentary access.</p>
          </SectionHeading>
          <div>
            <details>
              <summary>Can I purchase a plan online today?</summary>
              <p>
                Yes — use Subscribe / Buy on a plan card. You will complete payment on Stripe and
                return to your portal to download.
              </p>
            </details>
            <details>
              <summary>Where are my plan and download managed?</summary>
              <p>
                After sign-in, the customer portal shows plan status, renewal/cancel, device seat,
                and the authorised Windows installer download.
              </p>
            </details>
            <details>
              <summary>What happens if I cancel?</summary>
              <p>
                Cancellation stops auto-renewal. You remain entitled until the current period end,
                then download and activation stop until you subscribe again.
              </p>
            </details>
          </div>
        </div>
      </section>

      <ConversionBand
        title="Need help choosing the right path?"
        copy="Talk through the product and your operating model before making a subscription decision."
        primary={{ label: "Request a demo", to: "/contact" }}
        secondary={{ label: "Open portal", to: user ? "/app" : "/login" }}
      />
    </div>
  );
}
