import Link from "next/link";

export const metadata = {
  title: "Services — PROTOFORM",
  description:
    "3D modeling & CAD engineering, simulation & DFM, and 3D printing & prototyping services.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <span className="subhero__tag">Services</span>
          <h1 className="subhero__title"><span className="line"><span>From idea to <em>physical part</em></span></span></h1>
          <p className="subhero__lead">Three tightly-linked capabilities cover the whole journey — engineering the geometry, proving it, and putting a real prototype in your hands.</p>
        </div>
      </section>

      <section className="section section--tight services">
        <div className="services__grid">
          <article className="card reveal"><span className="card__index">01</span><h3>3D Modeling &amp; CAD Engineering</h3><p>Detailed 3D design of parts and assemblies from concept geometry, scans or 2D drawings — delivered as manufacturing-ready models with full dimensioned documentation.</p><ul><li>Part &amp; assembly modeling</li><li>2D → 3D conversion</li><li>Scan-to-CAD</li><li>Technical drawings</li></ul></article>
          <article className="card reveal"><span className="card__index">02</span><h3>Simulation &amp; DFM</h3><p>All necessary calculations and simulations performed, major design-for-manufacturing decisions implemented, tolerances and parameterization set, and a complete bill of materials specified.</p><ul><li>Engineering calculations</li><li>Design for manufacturing</li><li>Tolerances &amp; BOM</li><li>Parametric models</li></ul></article>
          <article className="card reveal"><span className="card__index">03</span><h3>3D Printing &amp; Prototyping</h3><p>Designs made ready for physical prototyping and printed in PET-G, ABS, ABS+ and more — including reverse-engineered replacement parts you can&apos;t buy anywhere.</p><ul><li>Rapid prototyping</li><li>PET-G / ABS / ABS+</li><li>Reverse engineering</li><li>Spare-part printing</li></ul></article>
        </div>
      </section>

      <section className="section section--tight">
        <div className="section__head">
          <span className="section__tag reveal">How it maps to real work</span>
          <h2 className="section__title reveal-mask"><span>Proof, not <em>promises</em></span></h2>
        </div>

        <div className="split reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="split__media"><img src="/projects/portfolio/valve-0.jpg" alt="Butterfly valve rebuilt as a parametric 3D model" /></div>
          <div className="split__body">
            <h3>CAD engineering at scale</h3>
            <p>For the Dutch company PELICAN WORLDWIDE we rebuilt over 150 DWG drawings into fully parametric 3D models in Autodesk Inventor — every tolerance carried across. The same discipline drove our centrifugal pumps, now in production in the Middle East.</p>
            <Link className="btn btn--ghost" href="/projects">See mechanical work</Link>
          </div>
        </div>

        <div className="split reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="split__media"><img src="/projects/services/foam-xsection.jpg" alt="Cross-section of the foam dispenser assembly" /></div>
          <div className="split__body">
            <h3>Simulation &amp; assemblies that fit</h3>
            <p>The Foam Dispenser needed a full adapter–seal–housing–washer–nut stack around a bent internal air-hose. We widened the tube, ran the fit and made sure every component sat exactly where it should before a single part was printed.</p>
            <Link className="btn btn--ghost" href="/projects">See the assembly</Link>
          </div>
        </div>

        <div className="split reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="split__media"><img src="/projects/portfolio/petggear-0.jpg" alt="3D-printed replacement sprocket beside the original factory part" /></div>
          <div className="split__body">
            <h3>Prototypes &amp; parts you can hold</h3>
            <p>When a part can&apos;t be bought anymore, we reverse-engineer it and print it — from PET-G replacement parts and factory sprockets to a reverse-engineered impeller printed with five walls at 100% infill.</p>
            <Link className="btn btn--ghost" href="/projects">See printed parts</Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__orb"></div>
        <div className="cta__inner">
          <h2 className="cta__title reveal-mask"><span>Let&apos;s scope your <em>project</em>.</span></h2>
          <p className="reveal">Share your idea, sketch or STEP file and we&apos;ll come back with cost and timing estimates.</p>
          <Link className="btn btn--big reveal" href="/contact">Request a quote</Link>
        </div>
      </section>
    </main>
  );
}
