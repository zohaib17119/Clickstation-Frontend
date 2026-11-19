import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Seo } from "../components/Seo";

export function DownloadPage() {
  const { user, loading } = useAuth();

  return (
    <div className="mkt">
      <Seo
        title="Download ClickStation for Windows"
        description="Subscribe on Pricing, then download the official Windows photo booth Setup from your customer portal and activate on the booth PC."
        path="/downloads"
      />
      <section className="mkt-hero mkt-hero-compact">
        <div className="software-shell hero-grid">
          <div className="animate-rise">
            <p className="eyebrow">Windows Setup</p>
            <h1>
              Official installer. <span>License on your PC.</span>
            </h1>
            <p className="lead">
              The Setup EXE is the same binary for everyone. Your paid or complimentary entitlement
              unlocks download; activation binds the license to one booth PC. Create an account,
              subscribe on Pricing (or get admin access), then download from your portal.
            </p>
            <div className="hero-actions">
              {!loading && user ? (
                <Link to="/app" className="btn btn-primary btn-lg">
                  Open download center
                </Link>
              ) : (
                <>
                  <Link to="/pricing" className="btn btn-primary btn-lg">
                    View pricing
                  </Link>
                  <Link to="/login" className="btn btn-ghost btn-lg mkt-ghost-on-dark">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
          <img
            className="hero-visual animate-rise-delay"
            src="/images/clickstation-interface-light.webp"
            alt="ClickStation interface"
          />
        </div>
      </section>

      <section className="mkt-section">
        <div className="software-shell">
          <p className="kicker">How it works</p>
          <h2>Three steps from zero to booth.</h2>
          <div className="steps">
            <article>
              <b>01</b>
              <h3>Create your account</h3>
              <p>Register with your work email, then use your account to manage the journey.</p>
            </article>
            <article>
              <b>02</b>
              <h3>Subscribe or get access</h3>
              <p>
                Choose Monthly, Yearly, or Event on Pricing and complete Stripe Checkout — or ask
                admin for complimentary access. Download unlocks only with an active entitlement.
              </p>
            </article>
            <article>
              <b>03</b>
              <h3>Download &amp; license</h3>
              <p>
                Download Windows Setup from your portal, install on the booth PC, then Activate with
                this login so the license binds to that machine (one seat).
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
