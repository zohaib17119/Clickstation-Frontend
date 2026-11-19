import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LOGO_SRC = import.meta.env.VITE_LOGO_URL ?? "/images/clickstation-logo.png";

export function RegisterPage() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planSlug = (params.get("plan") ?? "").trim().toLowerCase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    const next = planSlug ? `/app?plan=${encodeURIComponent(planSlug)}` : "/app";
    return <Navigate to={next} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(name, email, password);
      navigate(planSlug ? `/app?plan=${encodeURIComponent(planSlug)}` : "/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card animate-rise" onSubmit={onSubmit}>
        <img className="auth-card-logo" src={LOGO_SRC} alt="ClickStation" width={164} height={50} />
        <p className="kicker">Operator portal</p>
        <h1>Create account</h1>
        <p className="muted">
          {planSlug
            ? `You selected the “${planSlug}” plan. Create your account, then we’ll help you activate.`
            : "Create your operator account, then download and Activate on your booth PC."}
        </p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Name
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
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
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to={planSlug ? `/login?plan=${encodeURIComponent(planSlug)}` : "/login"}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
