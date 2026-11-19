import { Link } from "react-router-dom";
import { ConversionBand, PageHero, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const journey = [
  ["Prepare", "Choose a photo experience, prepare your template, and connect the camera and equipment for the event."],
  ["Capture", "Run a guest-led session with live view, countdown, and the capture flow configured for your setup."],
  ["Create", "Apply the selected output — photo, GIF, boomerang, or video — to the template and settings you prepared."],
  ["Deliver", "Print the result or use QR sharing, then keep the event organised through its gallery and storage workflow."],
];

export function HowItWorksPage() {
  return (
    <div className="mkt">
      <Seo
        title="How ClickStation works"
        description="See how a ClickStation photo booth event moves from preparation and capture to printing, sharing, and organisation."
        path="/how-it-works"
      />
      <PageHero
        eyebrow="How it works"
        title={<>A calm, repeatable workflow for live events.</>}
        intro="ClickStation is built around the way an event actually moves: prepare the setup, welcome the guest, capture the moment, and deliver a result worth keeping."
        actions={[
          { label: "Request a walkthrough", to: "/contact" },
          { label: "View Downloads", to: "/downloads", kind: "secondary" },
        ]}
      >
        <div className="how-hero-steps" aria-label="Event workflow overview">
          {journey.map(([title], index) => <span key={title}><b>0{index + 1}</b>{title}</span>)}
        </div>
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell">
          <SectionHeading eyebrow="The event loop" title="Four stages, designed to work together." centered />
          <ol className="journey-list">
            {journey.map(([title, copy], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <div><h2>{title}</h2><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell readiness-grid">
          <div>
            <p className="kicker">Before event day</p>
            <h2>Set up with the essentials in mind.</h2>
            <p>Start with your Windows PC, compatible camera workflow, preferred template, and printing or sharing plan.</p>
          </div>
          <ul>
            <li>Windows booth computer</li>
            <li>DSLR or webcam capture setup</li>
            <li>Prepared event templates</li>
            <li>Print and/or QR delivery plan</li>
          </ul>
          <Link to="/resources" className="text-link">Read setup guidance <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <ConversionBand
        title="Want to see the workflow with your setup in mind?"
        copy="We can walk through the pieces that matter for the kind of photo booth event you run."
      />
    </div>
  );
}
