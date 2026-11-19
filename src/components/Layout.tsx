import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LOGO_SRC = import.meta.env.VITE_LOGO_URL ?? "/images/clickstation-logo.png";

const productLinks = [
  ["Features", "/features"],
  ["Template designer", "/template-designer"],
  ["Photo experiences", "/photo-experiences"],
] as const;

const solutionLinks = [
  ["How it works", "/how-it-works"],
  ["Use cases", "/use-cases"],
  ["Gallery", "/gallery"],
] as const;

const resourceLinks = [
  ["Help center", "/resources"],
  ["Downloads", "/downloads"],
  ["Request a demo", "/contact"],
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const portalRoute = pathname === "/app" || pathname === "/admin";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="shell-app">
      <header className="site-header">
        <div className="nav-wrap">
          <Link to="/" className="logo-link" onClick={closeMenu} aria-label="ClickStation home">
            <img src={LOGO_SRC} alt="ClickStation" className="site-logo" />
          </Link>

          <nav className="desktop-nav marketing-nav" aria-label="Marketing navigation">
            <NavLink to="/features">Product</NavLink>
            <NavLink to="/template-designer">Templates</NavLink>
            <NavLink to="/photo-experiences">Experiences</NavLink>
            <NavLink to="/use-cases">Use cases</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </nav>

          <div className="nav-actions">
            {user ? (
              <Link to="/app" className={`portal-link${portalRoute ? " active" : ""}`}>
                Customer portal
              </Link>
            ) : (
              <Link to="/login" className="btn btn-ghost nav-sign-in">
                Sign in
              </Link>
            )}
            {user ? (
              <button type="button" className="btn btn-ghost nav-sign-in" onClick={logout}>
                Sign out
              </button>
            ) : (
              <Link to="/contact" className="btn btn-primary nav-demo">
                Request a demo
              </Link>
            )}
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <p className="mobile-menu-label">Product</p>
          {productLinks.map(([label, to]) => (
            <NavLink to={to} onClick={closeMenu} key={to}>
              {label}
            </NavLink>
          ))}
          <p className="mobile-menu-label">Explore</p>
          {solutionLinks.map(([label, to]) => (
            <NavLink to={to} onClick={closeMenu} key={to}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/pricing" onClick={closeMenu}>
            Pricing
          </NavLink>
          {resourceLinks.map(([label, to]) => (
            <NavLink to={to} onClick={closeMenu} key={to}>
              {label}
            </NavLink>
          ))}
          <div className="mobile-portal-links">
            <p className="mobile-menu-label">Customer portal</p>
            {user ? (
              <>
                <NavLink to="/app" onClick={closeMenu}>
                  My account
                </NavLink>
                {user.role === "admin" ? (
                  <NavLink to="/admin" onClick={closeMenu}>
                    Admin
                  </NavLink>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>
                  Sign in
                </NavLink>
                <NavLink to="/register" onClick={closeMenu}>
                  Create account
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="portal-main">{children}</main>

      <footer className="portal-footer">
        <div className="software-shell footer-grid">
          <div className="portal-footer-brand">
            <img src={LOGO_SRC} alt="ClickStation" className="portal-footer-logo" />
            <p>
              Professional Windows photo booth software for thoughtful guest experiences and the
              teams behind them.
            </p>
          </div>
          <FooterGroup title="Product" links={productLinks} />
          <FooterGroup title="Explore" links={solutionLinks} />
          <FooterGroup title="Resources" links={resourceLinks} />
          <div className="footer-portal">
            <h2>Customer portal</h2>
            <p>Download, activation, and account access are kept separate from the marketing site.</p>
            <Link to={user ? "/app" : "/login"}>{user ? "Open my account" : "Sign in"}</Link>
          </div>
        </div>
        <div className="software-shell footer-bottom">
          <span>© {new Date().getFullYear()} ClickStation. All rights reserved.</span>
          <span>Built for photo booth operators.</span>
        </div>
      </footer>
    </div>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div className="footer-link-group">
      <h2>{title}</h2>
      {links.map(([label, to]) => (
        <Link to={to} key={to}>
          {label}
        </Link>
      ))}
    </div>
  );
}
