import { Link } from "react-router-dom";
import { PageHero, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_URL as string | undefined;

function demoHref() {
  if (!WHATSAPP) return "/register";
  const separator = WHATSAPP.includes("?") ? "&" : "?";
  const text = encodeURIComponent("Hi ClickStation — I would like to request a product demo.");
  return `${WHATSAPP}${separator}text=${text}`;
}

export function ContactPage() {
  const href = demoHref();
  const external = Boolean(WHATSAPP);

  return (
    <div className="mkt">
      <Seo
        title="Request a ClickStation demo"
        description="Talk to ClickStation about a Windows photo booth software workflow for your photography, rental, or event business."
        path="/contact"
      />
      <PageHero
        eyebrow="Request a demo"
        title={<>Bring your event workflow. We’ll bring the product context.</>}
        intro="The best demo starts with the way you capture, deliver, and run events today. Tell us what you are planning and we can focus the conversation on the relevant pieces."
      >
        <div className="contact-hero-panel">
          <span>For photographers</span>
          <span>For rental teams</span>
          <span>For event agencies</span>
        </div>
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell contact-grid">
          <div>
            <SectionHeading eyebrow="What to bring" title="A useful conversation starts with a few real details.">
              <p>There is no lead form connected to a backend in this frontend, so this page uses the configured support conversation rather than pretending a submission was received.</p>
            </SectionHeading>
            <ul className="contact-topic-list">
              <li>Your typical event or booking type</li>
              <li>Your preferred capture setup: DSLR or webcam</li>
              <li>Whether printing, QR sharing, or both matter for delivery</li>
              <li>The photo experience and branding you want to deliver</li>
            </ul>
          </div>
          <aside className="contact-action-card">
            <p className="kicker">Start the conversation</p>
            <h2>Request a focused ClickStation walkthrough.</h2>
            <p>We will use your workflow as the starting point — not a generic software tour.</p>
            {external ? (
              <a className="btn btn-primary btn-lg" href={href} target="_blank" rel="noreferrer">
                Request a demo on WhatsApp
              </a>
            ) : (
              <Link className="btn btn-primary btn-lg" to={href}>
                Create an account to start
              </Link>
            )}
            <Link to="/resources" className="text-link">Read setup guidance first <span aria-hidden="true">→</span></Link>
          </aside>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell demo-agenda">
          <SectionHeading eyebrow="A demo built around your work" title="What we can cover together." centered />
          <div>
            <article><span>01</span><h3>Capture setup</h3><p>Discuss DSLR or webcam capture for your event format.</p></article>
            <article><span>02</span><h3>Guest experience</h3><p>Walk through templates, photo experiences, printing, and QR delivery.</p></article>
            <article><span>03</span><h3>Getting event-ready</h3><p>Cover account activation, the Windows download, and the operating workflow.</p></article>
          </div>
        </div>
      </section>
    </div>
  );
}
