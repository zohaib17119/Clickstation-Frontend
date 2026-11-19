import { Link } from "react-router-dom";
import { ConversionBand, PageHero, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const resourceGroups = [
  {
    title: "Getting started",
    items: ["Choosing a Windows booth computer", "Connecting a DSLR or webcam", "Preparing an event template", "Planning print and QR delivery"],
  },
  {
    title: "Running events",
    items: ["Session-flow checklist", "Photo, GIF, boomerang, and video choices", "Using filters, chroma key, and AI backgrounds", "Event and gallery organisation"],
  },
  {
    title: "Account and licensing",
    items: ["Creating an account", "Activation and the Windows download", "Machine-bound licenses", "Offline operation and 72-hour grace"],
  },
];

export function ResourcesPage() {
  return (
    <div className="mkt">
      <Seo
        title="Help Center and setup resources"
        description="Find ClickStation help for setup, event operation, Windows downloads, account activation, and photo booth workflows."
        path="/resources"
      />
      <PageHero
        eyebrow="Resources and Help Center"
        title={<>Practical guidance for your next event.</>}
        intro="Use the Help Center as the starting point for setup, operating workflow, licensing, and account questions."
        actions={[
          { label: "Download for Windows", to: "/downloads" },
          { label: "Contact support", to: "/contact", kind: "secondary" },
        ]}
      >
        <div className="resource-hero-card" aria-label="Help Center categories">
          <span>Setup</span><span>Events</span><span>Account</span><span>Licensing</span>
        </div>
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell">
          <SectionHeading eyebrow="Start where you are" title="Guidance organised around the jobs you need to do." />
          <div className="resource-grid">
            {resourceGroups.map((group) => (
              <article key={group.title}>
                <h2>{group.title}</h2>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell faq-full">
          <SectionHeading eyebrow="Frequently asked questions" title="Clear answers before event day." />
          <details open>
            <summary>What operating system does ClickStation support?</summary>
            <p>ClickStation is professional photo booth software designed for Windows.</p>
          </details>
          <details>
            <summary>Can I use a DSLR and a webcam?</summary>
            <p>ClickStation supports DSLR and webcam capture workflows.</p>
          </details>
          <details>
            <summary>How do I get the Windows installer?</summary>
            <p>Create an account, complete activation, then download the installer from the customer portal.</p>
          </details>
          <details>
            <summary>Can ClickStation continue during an internet disruption?</summary>
            <p>ClickStation supports offline operation with a 72-hour license grace period.</p>
          </details>
          <details>
            <summary>How are licenses managed?</summary>
            <p>The Windows license is bound to the booth PC through your ClickStation account activation.</p>
          </details>
        </div>
      </section>

      <section className="mkt-section">
        <div className="software-shell resource-account-band">
          <div>
            <p className="kicker">Already a customer?</p>
            <h2>Downloads and activation belong in your portal.</h2>
            <p>Keep operational account tasks separate from product exploration.</p>
          </div>
          <Link to="/login" className="btn btn-dark btn-lg">Open customer portal</Link>
        </div>
      </section>

      <ConversionBand
        title="Need guidance that fits your workflow?"
        copy="Start a conversation with the ClickStation team and bring your event setup questions with you."
      />
    </div>
  );
}
