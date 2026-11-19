import { Link } from "react-router-dom";
import { ConversionBand, PageHero, ProductShot, SectionHeading } from "../components/Marketing";
import { Seo } from "../components/Seo";

const requiredAssets = [
  ["Capture flow", "A full DSLR capture session from attract screen through retake and acceptance."],
  ["Template designer", "A screen recording showing canvas, layers, element properties, and an exported layout."],
  ["Printing and QR", "A short real-event demonstration from final image to print and QR collection."],
  ["Photo experiences", "Photo, GIF, boomerang, video, chroma key, and AI background examples from actual events."],
  ["Event gallery", "A finished event gallery with the operator’s organisation and guest-delivery journey."],
  ["Activation", "A concise desktop activation walkthrough, including the account portal and license status."],
];

export function GalleryPage() {
  return (
    <div className="mkt">
      <Seo
        title="ClickStation product gallery"
        description="View the ClickStation product gallery and the real product captures needed to document its Windows photo booth workflow."
        path="/gallery"
      />
      <PageHero
        eyebrow="Product gallery"
        title={<>See the product in the moments it is made for.</>}
        intro="This gallery starts with the authentic ClickStation screens available in the current site build. As production captures are added, it becomes the visual proof of the complete event workflow."
        actions={[
          { label: "Request a live demo", to: "/contact" },
          { label: "Explore the product", to: "/features", kind: "secondary" },
        ]}
      >
        <ProductShot src="/images/clickstation-interface-light.webp" alt="ClickStation interface collage" />
      </PageHero>

      <section className="mkt-section">
        <div className="software-shell">
          <SectionHeading eyebrow="Current product imagery" title="Two real ClickStation product visuals are available in this repository.">
            <p>
              The existing image library contains product-interface artwork and a laptop product view.
              It does not yet contain event photography or a complete set of high-resolution product captures.
            </p>
          </SectionHeading>
          <div className="gallery-current-grid">
            <ProductShot src="/images/clickstation-interface-light.webp" alt="ClickStation interface and sharing screens" caption="Current asset: ClickStation interface composite." />
            <ProductShot src="/images/dashboard-hero-laptop.png" alt="ClickStation on a laptop" caption="Current asset: ClickStation laptop view." />
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-section-soft">
        <div className="software-shell">
          <SectionHeading eyebrow="Production brief" title="The exact visual captures to add next." />
          <div className="asset-request-grid">
            {requiredAssets.map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="gallery-guidance">
            Capture these from the real desktop application and real events; use 16:9 screen
            recordings, 2× desktop screenshots, and consented event imagery. This keeps the website
            visually rich without substituting invented product visuals or fabricated social proof.
          </p>
        </div>
      </section>

      <section className="mkt-section">
        <div className="software-shell gallery-process">
          <div>
            <p className="kicker">Asset delivery standard</p>
            <h2>Make each visual earn its place in the customer journey.</h2>
          </div>
          <p>Use real screens in feature explanations, real event footage in experience pages, and short product demonstrations near conversion calls to action.</p>
          <Link to="/resources" className="text-link">Read the launch checklist <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <ConversionBand
        title="Want to see ClickStation working live?"
        copy="Book a demonstration rather than relying on a generic product mockup."
      />
    </div>
  );
}
