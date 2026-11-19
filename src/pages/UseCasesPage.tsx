import { Link } from "react-router-dom";
import { ConversionBand, PageHero, ProductShot, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const audiences = [
  {
    id: "photographers",
    number: "01",
    eyebrow: "For photographers",
    title: "Create an event experience that extends your craft.",
    copy: "Bring a dedicated photo booth flow to weddings, private events, and client activations without giving up control over the final look.",
    points: ["DSLR or webcam capture", "Template-led photo delivery", "Professional printing and QR sharing"],
  },
  {
    id: "rental-businesses",
    number: "02",
    eyebrow: "For photo booth rental businesses",
    title: "Turn repeatable preparation into consistent delivery.",
    copy: "Prepare a considered setup before the event, then run a guest experience that your team can repeat from one booking to the next.",
    points: ["Event and gallery management", "Prepared templates and experience choices", "Windows account and activation workflow"],
  },
  {
    id: "event-agencies",
    number: "03",
    eyebrow: "For event management agencies",
    title: "Give the activation a branded interaction, not another station in the room.",
    copy: "Create photo experiences that support the event concept, from a chosen layout to the format guests take away with them.",
    points: ["Branded layouts and outputs", "Photo, GIF, boomerang, and video options", "QR sharing for guest delivery"],
  },
];

export function UseCasesPage() {
  return (
    <div className="mkt">
      <Seo
        title="Photo booth software for photographers and event teams"
        description="ClickStation is designed for individual photographers, photo booth rental businesses, and event agencies."
        path="/use-cases"
      />
      <PageHero
        eyebrow="Use cases"
        title={<>Designed for the people who make the event happen.</>}
        intro="ClickStation supports the common goal across different teams: deliver a photo experience that feels smooth for guests and manageable for the operator."
        actions={[
          { label: "Talk through your use case", to: "/contact" },
          { label: "Explore features", to: "/features", kind: "secondary" },
        ]}
      >
        <ProductShot
          src="/images/dashboard-hero-laptop.png"
          alt="ClickStation running on a laptop"
          caption="The same core workflow can support different ways of running an event."
        />
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell">
          <SectionHeading eyebrow="Who ClickStation is for" title="Start with the way you work, then shape the experience around it." />
          <div className="use-case-list">
            {audiences.map((audience) => (
              <article id={audience.id} key={audience.id}>
                <span>{audience.number}</span>
                <div>
                  <p className="kicker">{audience.eyebrow}</p>
                  <h2>{audience.title}</h2>
                  <p>{audience.copy}</p>
                </div>
                <ul>
                  {audience.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell use-case-note">
          <div>
            <p className="kicker">One source of truth</p>
            <h2>Keep the technical workflow under operator control.</h2>
          </div>
          <p>
            Marketing pages help visitors understand the product. Account activation, Windows
            downloads, and the operational controls remain in the customer portal where they belong.
          </p>
          <Link to="/downloads" className="text-link">See the download journey <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <ConversionBand
        title="Bring your real event workflow to the conversation."
        copy="Tell us how you shoot, deliver, and manage events, and we will help you assess the ClickStation fit."
      />
    </div>
  );
}
