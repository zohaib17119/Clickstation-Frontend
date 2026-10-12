import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function WindowsPage() {
  const { user, loading } = useAuth();

  return (
    <>
      <section className="windows-hero">
        <div className="software-shell hero-grid">
          <div>
            <p className="eyebrow">Windows desktop edition</p>
            <h1>
              Get ClickStation for Windows. <span>Official.</span>
            </h1>
            <p className="lead">
              Create your account, complete activation, then download the Windows installer. After
              install, activate on this PC with your ClickStation entitlement.
            </p>
            <div className="hero-actions">
              {!loading && user ? (
                <Link to="/app" className="btn btn-primary btn-lg">
                  Open download center
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Create account
                  </Link>
                  <Link to="/login" className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,.2)", background: "rgba(255,255,255,.06)" }}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
            <div className="trust-row">
              <span>250K+ downloads</span>
              <span>79K+ active users</span>
              <span>Direct support</span>
            </div>
          </div>
          <img
            className="hero-visual"
            src="/images/clickstation-interface-light.webp"
            alt="ClickStation photo booth software interface"
          />
        </div>
      </section>

      <section className="windows-steps">
        <div className="software-shell">
          <p className="kicker">How Windows access works</p>
          <h2>Three simple steps.</h2>
          <div className="steps">
            <article>
              <b>01</b>
              <h3>Create your account</h3>
              <p>Register with your work email so we can manage your Windows entitlement.</p>
            </article>
            <article>
              <b>02</b>
              <h3>Payment &amp; activation</h3>
              <p>
                Choose a plan and complete payment. An admin activates your subscription when
                payment is confirmed (Stripe comes later).
              </p>
            </article>
            <article>
              <b>03</b>
              <h3>Download &amp; license</h3>
              <p>
                Download the Windows installer when active, then activate on this PC with your
                account.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
