import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LOGO_SRC = import.meta.env.VITE_LOGO_URL ?? "/images/clickstation-logo.png";

export function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const planSlug = (searchParams.get("plan") ?? "").trim().toLowerCase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fromState = (location.state as { from?: string } | null)?.from;
  const afterLogin = planSlug
    ? `/app?plan=${encodeURIComponent(planSlug)}`
    : fromState && fromState.startsWith("/")
      ? fromState
      : "/app";

  if (!loading && user) {
    const dest =
      user.role === "admin"
        ? "/admin"
        : planSlug
          ? `/app?plan=${encodeURIComponent(planSlug)}`
          : "/app";
    return <Navigate to={dest} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(afterLogin);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card animate-rise" onSubmit={onSubmit}>
        <img className="auth-card-logo" src={LOGO_SRC} alt="ClickStation" width={164} height={50} />
        <p className="kicker">Operator portal</p>
        <h1>Sign in</h1>
        <p className="muted">
          {planSlug
            ? `Continue to the “${planSlug}” plan after sign-in.`
            : "Download Windows software and manage your booth license."}
        </p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="auth-switch">
          New here?{" "}
          <Link to={planSlug ? `/register?plan=${encodeURIComponent(planSlug)}` : "/register"}>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
