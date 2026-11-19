import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Action = {
  label: string;
  to: string;
  kind?: "primary" | "secondary" | "dark";
};

export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  actions?: Action[];
  children?: ReactNode;
}) {
  return (
    <section className="product-page-hero">
      <div className="software-shell product-page-hero-grid">
        <div className="reveal-up">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="product-page-lead">{intro}</p>
          {actions?.length ? (
            <div className="hero-actions">
              {actions.map((action) => (
                <Link
                  className={`btn ${
                    action.kind === "secondary"
                      ? "btn-ghost btn-ghost-on-ink"
                      : action.kind === "dark"
                        ? "btn-dark"
                        : "btn-primary"
                  } btn-lg`}
                  to={action.to}
                  key={action.label}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {children ? <div className="reveal-up reveal-late">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={`section-heading${centered ? " section-heading-centered" : ""}`}>
      {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children ? <div className="section-intro">{children}</div> : null}
    </div>
  );
}

export function ProductShot({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`product-shot ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ConversionBand({
  title,
  copy,
  primary = { label: "Request a demo", to: "/contact" },
  secondary,
}: {
  title: string;
  copy: string;
  primary?: Action;
  secondary?: Action;
}) {
  return (
    <section className="conversion-section">
      <div className="software-shell conversion-band">
        <div>
          <p className="kicker">Get event-ready</p>
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>
        <div className="hero-actions">
          <Link to={primary.to} className="btn btn-primary btn-lg">
            {primary.label}
          </Link>
          {secondary ? (
            <Link to={secondary.to} className="btn btn-ghost btn-lg">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
