import { Link } from "react-router-dom";
import { ConversionBand, PageHero, ProductShot, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const experiences = [
  ["Photo", "A considered still-photo session, ready for your selected template and final delivery."],
  ["GIF", "Bring a sequence of moments together in a format made to feel lively and shareable."],
  ["Boomerang", "Add playful motion with a looping capture experience for high-energy occasions."],
  ["Video", "Record a guest-led video experience where the event calls for more than a still."],
];

export function ExperiencesPage() {
  return (
    <div className="mkt">
      <Seo
        title="Photo, GIF, boomerang, and video experiences"
        description="Choose photo, GIF, boomerang, and video capture experiences for your next ClickStation event."
        path="/photo-experiences"
      />
      <PageHero
        eyebrow="Photo experiences"
        title={<>Give guests a reason to step into the frame.</>}
        intro="From polished photo outputs to GIF, boomerang, and video sessions, choose the format that makes sense for the room and the occasion."
        actions={[
          { label: "Plan an experience", to: "/contact" },
          { label: "Explore use cases", to: "/use-cases", kind: "secondary" },
        ]}
      >
        <ProductShot
          src="/images/clickstation-interface-light.webp"
          alt="ClickStation’s capture and sharing product screens"
          caption="A guest experience is only as good as the path from capture to delivery."
        />
      </PageHero>

      <section className="mkt-section experience-grid-section">
        <div className="software-shell">
          <SectionHeading eyebrow="Choose the right energy" title="Different formats, one well-prepared session." />
          <div className="experience-grid">
            {experiences.map(([name, copy], index) => (
              <article className={`experience-card experience-card-${index + 1}`} key={name}>
                <span>0{index + 1}</span>
                <h2>{name}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell experience-control-layout">
          <div className="experience-control-visual" aria-hidden="true">
            <div className="control-live-view"><span>Live view</span></div>
            <div className="control-stack"><span>Template</span><span>Filter</span><span>Delivery</span></div>
          </div>
          <div>
            <p className="kicker">Make the format yours</p>
            <h2>Shape the look around the moment.</h2>
            <p>
              Pair an experience with your selected template, filters, chroma key, or AI background
              configuration. The format may change, but the event should still look and feel like one story.
            </p>
            <Link to="/template-designer" className="text-link">Explore template design <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <ConversionBand
        title="Find the experience that fits your next event."
        copy="Tell us about the room, the guests, and the kind of final result you want to deliver."
        secondary={{ label: "How it works", to: "/how-it-works" }}
      />
    </div>
  );
}
