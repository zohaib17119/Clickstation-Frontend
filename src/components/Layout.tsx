import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const SITE = import.meta.env.VITE_SITE_URL ?? "https://clickstation.pk";
const LOGO_SRC = import.meta.env.VITE_LOGO_URL ?? "/images/clickstation-logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="shell-app">
      <header className="site-header">
        <div className="nav-wrap">
          <a href={SITE} className="logo-link" aria-label="ClickStation home">
            <img src={LOGO_SRC} alt="ClickStation" className="site-logo" />
          </a>

          <nav className="desktop-nav" aria-label="Portal navigation">
            <a href={SITE}>Home</a>
            <a href={`${SITE}/photo-booth-software`}>Software</a>
            <a href={`${SITE}/downloads`}>Downloads</a>
            <NavLink to="/windows">Windows</NavLink>
            {user && <NavLink to="/app">Account</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          </nav>

          <div className="nav-actions">
            {!user && (
              <Link to="/login" className="btn btn-ghost">
                Sign in
              </Link>
            )}
            {!user && (
              <Link to="/register" className="btn btn-primary">
                Get access
              </Link>
            )}
            {user && (
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Sign out
              </button>
            )}
            <button
              className="menu-button"
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <a href={SITE} onClick={closeMenu}>
            Home
          </a>
          <a href={`${SITE}/photo-booth-software`} onClick={closeMenu}>
            Software
          </a>
          <a href={`${SITE}/downloads`} onClick={closeMenu}>
            Downloads
          </a>
          <NavLink to="/windows" onClick={closeMenu}>
            Windows
          </NavLink>
          {user && (
            <NavLink to="/app" onClick={closeMenu}>
              Account
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={closeMenu}>
              Admin
            </NavLink>
          )}
          {!user && (
            <NavLink to="/login" onClick={closeMenu}>
              Sign in
            </NavLink>
          )}
          {!user && (
            <NavLink to="/register" onClick={closeMenu}>
              Get access
            </NavLink>
          )}
          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      <main className="portal-main">{children}</main>

      <footer className="portal-footer">
        <div className="portal-footer-inner">
          <p>ClickStation Windows software portal — official download &amp; account access.</p>
          <a href={SITE}>clickstation.pk</a>
        </div>
      </footer>
    </div>
  );
}
