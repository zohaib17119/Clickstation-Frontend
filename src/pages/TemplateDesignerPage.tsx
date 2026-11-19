import { Link } from "react-router-dom";
import { CheckList, ConversionBand, PageHero, ProductShot, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const steps = [
  ["Start with the output", "Choose the print, strip, collage, or digital format your event needs."],
  ["Compose the layout", "Arrange photo slots, text, QR, and graphic elements for the desired look."],
  ["Prepare for the session", "Set the active template or favourite the layouts you want available at the booth."],
  ["Run and refine", "Use the selected design during capture and iterate before your next event."],
];

export function TemplateDesignerPage() {
  return (
    <div className="mkt">
      <Seo
        title="Photo booth template designer"
        description="Create custom photo booth templates, photo strips, collages, and event-ready output layouts in ClickStation."
        path="/template-designer"
      />
      <PageHero
        eyebrow="Template designer"
        title={<>Build a layout guests will want to keep.</>}
        intro="Design the photo strips, collages, and custom templates that turn a capture session into a branded keepsake."
        actions={[
          { label: "Request a designer demo", to: "/contact" },
          { label: "See photo experiences", to: "/photo-experiences", kind: "secondary" },
        ]}
      >
        <ProductShot
          src="/images/dashboard-hero-laptop.png"
          alt="ClickStation product displayed on a laptop"
          caption="Configure the event output before guests step in front of the camera."
        />
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell designer-overview">
          <div>
            <SectionHeading eyebrow="Your event, in the details" title="Create the visual system around every capture.">
              <p>
                A template should feel like part of the event, not an afterthought. Use the designer
                to set up the photo areas and visual elements that make a final output feel finished.
              </p>
            </SectionHeading>
            <CheckList
              items={[
                "Custom photo templates, strips, and collages",
                "Photo slots, text, QR codes, and shape elements",
                "Custom sizes in inches, centimetres, or pixels at 300 DPI",
                "Rulers, alignment guidance, and shared photo-frame options",
              ]}
            />
          </div>
          <div className="designer-canvas" aria-label="Template designer layout illustration">
            <div className="designer-toolbar"><i /><i /><i /><i /></div>
            <div className="designer-sheet">
              <span className="designer-sheet-mark">Your event</span>
              <div className="designer-photo designer-photo-one" />
              <div className="designer-photo designer-photo-two" />
              <div className="designer-copy-line" />
              <div className="designer-copy-line short" />
              <div className="designer-code" />
            </div>
            <div className="designer-properties"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell">
          <SectionHeading eyebrow="From blank canvas to active template" title="Make template preparation a repeatable part of your setup." centered />
          <ol className="template-step-grid">
            {steps.map(([title, copy], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mkt-section">
        <div className="software-shell template-callout">
          <div>
            <p className="kicker">Prepared for the floor</p>
            <h2>Set the active template, then let the guest experience stay focused.</h2>
          </div>
          <p>
            Keep commonly used layouts ready for the event, so the capture flow can move from the
            moment to a professional final without reworking the design mid-session.
          </p>
          <Link to="/how-it-works" className="text-link">See the complete workflow <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <ConversionBand
        title="See how template preparation fits your event workflow."
        copy="Book a demo to walk through a practical setup for the types of sessions you run."
      />
    </div>
  );
}
