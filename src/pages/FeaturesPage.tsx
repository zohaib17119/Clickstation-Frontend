import { Link } from "react-router-dom";
import { CheckList, ConversionBand, PageHero, ProductShot, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const features = [
  {
    eyebrow: "Capture",
    title: "Run the session with confidence.",
    copy: "Connect a tethered DSLR or webcam, present a considered live view, and guide guests through a clean capture flow with countdown and retake control.",
    bullets: [
      "DSLR and webcam capture",
      "Live view, countdown, and capture sessions",
      "Photo-session crop guidance for selected layouts",
      "Operator-controlled guest flow",
    ],
  },
  {
    eyebrow: "Create",
    title: "Make every output belong to the event.",
    copy: "Build photo templates, strips, and collages, then choose the outputs that fit the atmosphere. From still photos to motion, your selected experience starts with a layout that feels intentional.",
    bullets: [
      "Custom templates, photo strips, and collages",
      "GIF and boomerang experiences",
      "Video recording options",
      "Filters, chroma key, and AI background experiences",
    ],
  },
  {
    eyebrow: "Deliver",
    title: "Give guests a result worth taking with them.",
    copy: "Finish a session with professional printing or QR sharing, then retain the control you need over where those photos live and how the event is organised.",
    bullets: [
      "Professional printing workflows",
      "QR code sharing",
      "Local and Cloudflare-backed photo storage",
      "Event and gallery management",
    ],
  },
];

export function FeaturesPage() {
  return (
    <div className="mkt">
      <Seo
        title="Photo booth software features"
        description="Explore ClickStation capture, template design, photo experiences, printing, sharing, and event management features."
        path="/features"
      />
      <PageHero
        eyebrow="The ClickStation product"
        title={<>The practical tools behind a polished guest experience.</>}
        intro="ClickStation brings capture, templates, photo experiences, printing, sharing, and event management together in one Windows photo booth workflow."
        actions={[
          { label: "Request a demo", to: "/contact" },
          { label: "Explore templates", to: "/template-designer", kind: "secondary" },
        ]}
      >
        <ProductShot
          src="/images/clickstation-interface-light.webp"
          alt="The ClickStation live booth and sharing interface"
          caption="A real ClickStation product screen used throughout the site."
        />
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell feature-intro-layout">
          <SectionHeading eyebrow="A connected workflow" title="From first tap to final delivery, keep the important moments together.">
            <p>
              The product is designed for the pace of real events: prepare your setup, run the
              guest session, deliver the output, and stay organised after the room clears.
            </p>
          </SectionHeading>
          <div className="feature-statements">
            <span>Windows desktop workflow</span>
            <span>Offline-ready licensing</span>
            <span>Operator-first controls</span>
          </div>
        </div>
      </section>

      <section className="feature-story-section">
        <div className="software-shell feature-story-list">
          {features.map((feature, index) => (
            <article className={`feature-story${index % 2 ? " feature-story-reverse" : ""}`} key={feature.eyebrow}>
              <div className="feature-story-copy">
                <p className="kicker">{feature.eyebrow}</p>
                <h2>{feature.title}</h2>
                <p>{feature.copy}</p>
                <CheckList items={feature.bullets} />
              </div>
              {index === 0 ? (
                <ProductShot
                  src="/images/dashboard-hero-laptop.png"
                  alt="ClickStation displayed in a laptop workflow"
                  caption="Prepare the booth experience on your Windows setup."
                />
              ) : index === 1 ? (
                <div className="feature-experience-canvas" aria-label="Photo experience feature categories">
                  <span>Photo</span>
                  <span>GIF</span>
                  <span>Boomerang</span>
                  <span>Video</span>
                  <p>Choose the experience, then configure the visual treatment around it.</p>
                </div>
              ) : (
                <div className="feature-delivery-canvas" aria-label="Printing and sharing workflow">
                  <div><b>Print</b><span>Professional output</span></div>
                  <div><b>Share</b><span>QR code delivery</span></div>
                  <div><b>Organise</b><span>Events and galleries</span></div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell product-guardrails">
          <div>
            <p className="kicker">Built for the realities of events</p>
            <h2>Keep working when venue Wi-Fi lets you down.</h2>
          </div>
          <p>
            ClickStation supports offline operation with a 72-hour license grace period, so a
            temporary loss of connection does not have to interrupt the event you are running.
          </p>
          <Link to="/how-it-works" className="text-link">See the operating flow <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <ConversionBand
        title="See the product in the context of your workflow."
        copy="Whether you are preparing a rental setup, a brand activation, or a photography experience, a short demo is the best place to start."
        secondary={{ label: "See use cases", to: "/use-cases" }}
      />
    </div>
  );
}
