import { Link } from "react-router-dom";
import { CheckList, ConversionBand, ProductShot, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";
import { useAuth } from "../auth/AuthContext";

const capabilityCards = [
  {
    number: "01",
    title: "Capture with the gear you trust",
    text: "Run sessions with a tethered DSLR or webcam, then keep the guest flow focused on the moment.",
  },
  {
    number: "02",
    title: "Design once, deliver on-brand",
    text: "Build photo strips, collages, and custom layouts in the template designer before event day.",
  },
  {
    number: "03",
    title: "Make it an experience",
    text: "Offer photos, GIFs, boomerangs, and video sessions with the right look for the event.",
  },
  {
    number: "04",
    title: "Print and share with confidence",
    text: "Move from a finished capture to professional printing or QR-based sharing without breaking the flow.",
  },
  {
    number: "05",
    title: "Keep events organised",
    text: "Manage events and galleries, while local and Cloudflare-backed storage support your sharing workflow.",
  },
  {
    number: "06",
    title: "Stay ready when Wi-Fi is not",
    text: "ClickStation is designed for Windows operation with a 72-hour license grace period for offline events.",
  },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="mkt premium-home">
      <Seo
        title="Professional photo booth software for Windows"
        description="ClickStation helps photographers, photo booth rental teams, and event agencies run polished Windows photo booth experiences."
        path="/"
      />

      <section className="home-hero">
        <div className="home-hero-aura" aria-hidden="true" />
        <div className="software-shell home-hero-grid">
          <div className="home-hero-copy reveal-up">
            <p className="eyebrow">Professional Windows photo booth software</p>
            <h1>
              Every guest moment,
              <span> beautifully in motion.</span>
            </h1>
            <p className="home-hero-lead">
              ClickStation gives photographers, rental businesses, and event teams one focused
              place to capture, create, print, share, and manage photo booth experiences.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Request a demo
              </Link>
              <Link to="/downloads" className="btn btn-ghost btn-ghost-on-ink btn-lg">
                Download for Windows
              </Link>
            </div>
            <div className="hero-proof-row" aria-label="Product highlights">
              <span>DSLR + webcam capture</span>
              <span>Print + QR sharing</span>
              <span>Built for Windows</span>
            </div>
          </div>
          <div className="home-hero-visual reveal-up reveal-late">
            <div className="hero-window-label">ClickStation capture workflow</div>
            <ProductShot
              src="/images/clickstation-interface-light.webp"
              alt="ClickStation interface showing its live booth and sharing experience"
            />
            <div className="hero-floating-card hero-floating-card-top">
              <span className="floating-kicker">From live view</span>
              <strong>to a polished guest delivery</strong>
            </div>
            <div className="hero-floating-card hero-floating-card-bottom">
              <span className="status-dot" aria-hidden="true" />
              Ready for the next session
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section workflow-section">
        <div className="software-shell">
          <SectionHeading eyebrow="Designed around the event floor" title="A smoother path from arrival to keepsake.">
            <p>
              A great booth feels effortless to guests and controllable for the person running it.
              ClickStation connects the moments between those two outcomes.
            </p>
          </SectionHeading>
          <ol className="workflow-list">
            <li>
              <span>01</span>
              <div>
                <strong>Welcome</strong>
                <p>Set the tone with your attract screen and event-ready experience.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Capture</strong>
                <p>Guide guests through live view, countdown, and a session that keeps moving.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Create</strong>
                <p>Apply the selected layout and output for the occasion, campaign, or venue.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Deliver</strong>
                <p>Print a professional keepsake or let guests retrieve their result with a QR code.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell story-split">
          <div className="story-copy">
            <p className="kicker">Real product, practical control</p>
            <h2>Build the setup that fits the room — not a one-size-fits-all booth.</h2>
            <p>
              Move between DSLR and webcam capture, configure templates and printing, and choose a
              photo experience that matches the event. The controls stay with the operator while
              the guest journey stays simple.
            </p>
            <CheckList
              items={[
                "Custom photo templates, strips, and collages",
                "GIF, boomerang, and video capture options",
                "Filters, chroma key, and AI background experiences",
                "Event and gallery management for organised delivery",
              ]}
            />
            <Link to="/features" className="text-link">
              Explore the product <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ProductShot
            className="story-shot"
            src="/images/dashboard-hero-laptop.png"
            alt="ClickStation software displayed on a laptop"
            caption="Use the operator controls to prepare, run, and deliver an event experience."
          />
        </div>
      </section>

      <section className="mkt-section capability-section">
        <div className="software-shell">
          <SectionHeading eyebrow="The ClickStation toolkit" title="The details that make events feel considered." />
          <div className="capability-grid">
            {capabilityCards.map((card) => (
              <article className="capability-card" key={card.number}>
                <span>{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section use-case-preview">
        <div className="software-shell">
          <SectionHeading
            eyebrow="Built for the people running the room"
            title="One product. Different ways to put it to work."
            centered
          >
            <p>Start with the workflow you know and configure the experience around it.</p>
          </SectionHeading>
          <div className="audience-grid">
            <article>
              <p className="audience-number">For photographers</p>
              <h3>Turn a camera setup into an experience guests remember.</h3>
              <Link to="/use-cases#photographers">See the workflow <span aria-hidden="true">→</span></Link>
            </article>
            <article>
              <p className="audience-number">For rental teams</p>
              <h3>Standardise how every event is prepared, activated, and delivered.</h3>
              <Link to="/use-cases#rental-businesses">See the workflow <span aria-hidden="true">→</span></Link>
            </article>
            <article>
              <p className="audience-number">For event agencies</p>
              <h3>Deliver branded interactions that belong in the event plan.</h3>
              <Link to="/use-cases#event-agencies">See the workflow <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="mkt-section pricing-preview-section">
        <div className="software-shell pricing-preview">
          <div>
            <p className="kicker">Plans that can grow with you</p>
            <h2>Choose the right route to your next event.</h2>
            <p>
              Plan availability is managed through the ClickStation customer portal. Review the
              current options or talk to the team about your operating needs.
            </p>
          </div>
          <div className="pricing-preview-options" aria-label="Plan framework">
            <span>Starter</span>
            <span>Professional</span>
            <span>Business</span>
          </div>
          <Link to={user ? "/app" : "/pricing"} className="btn btn-dark btn-lg">
            {user ? "Open my plan" : "View plan options"}
          </Link>
        </div>
      </section>

      <section className="mkt-section faq-section">
        <div className="software-shell faq-preview-grid">
          <SectionHeading eyebrow="Questions, answered" title="Start with the practical details.">
            <p>Visit the Help Center for product, setup, licensing, and download guidance.</p>
          </SectionHeading>
          <div className="faq-preview-list">
            <details>
              <summary>Does ClickStation work with a DSLR and a webcam?</summary>
              <p>ClickStation is designed for DSLR and webcam capture on Windows.</p>
            </details>
            <details>
              <summary>Can I work when an event venue has unreliable internet?</summary>
              <p>ClickStation supports offline operation with a 72-hour license grace period.</p>
            </details>
            <details>
              <summary>Where do I download the Windows software?</summary>
              <p>After account activation, download the official installer from your customer portal.</p>
            </details>
            <Link to="/resources" className="text-link">
              Go to Help Center <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ConversionBand
        title="Let’s shape your next photo booth experience."
        copy="See the product in context, discuss your workflow, and decide whether ClickStation fits the way you run events."
        secondary={{ label: "See how it works", to: "/how-it-works" }}
      />
    </div>
  );
}
