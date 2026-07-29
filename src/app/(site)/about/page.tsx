import Link from "next/link";

export const metadata = {
  title: "About — PROTOFORM",
  description:
    "A team of mechanical engineers delivering CAD, simulation and 3D-printed prototypes.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <span className="subhero__tag">About</span>
          <h1 className="subhero__title"><span className="line"><span>Engineers who <em>ship parts</em></span></span></h1>
          <p className="subhero__lead">We assist you as a team of engineers in product development through a CAD approach. We come from different departments and speak different languages, but we partner to solve our customers&apos; problems with the most amazing simulation solutions available.</p>
        </div>
      </section>

      <section className="section section--tight abilities">
        <div className="abilities__grid">
          <p className="abilities__text reveal">
            With a background as mechanical design engineers, we&apos;ve spent years turning ideas, sketches, scans and old 2D drawings into precise 3D models — then proving them and printing them. The result is a portfolio that spans production machinery, consumer products and one-off replacement parts.
          </p>
          <div className="stats">
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="250">0</span>+</span><span className="stat__label">Total projects, worldwide clients</span></div>
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="37">0</span></span><span className="stat__label">Projects in this portfolio</span></div>
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="60">0</span></span><span className="stat__label">Short-term projects delivered</span></div>
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="3">0</span>+</span><span className="stat__label">Years of mechanical design engineering</span></div>
          </div>
        </div>
        <ul className="benefits">
          <li className="reveal"><span>01</span>Community</li>
          <li className="reveal"><span>02</span>Quality</li>
          <li className="reveal"><span>03</span>On time</li>
          <li className="reveal"><span>04</span>Efficiency</li>
        </ul>
      </section>

      <section className="section section--tight workflow">
        <div className="section__head">
          <span className="section__tag reveal">Project workflow</span>
          <h2 className="section__title reveal-mask"><span>How we <em>work</em></span></h2>
        </div>
        <div className="workflow__grid">
          <div className="workflow__timeline">
            <div className="workflow__line"><span id="wfLine"></span></div>
            <ol className="workflow__steps">
              <li className="wstep reveal"><b>Phase 01</b><h4>Detailed 3D design + engineering</h4><p>Your idea, sketch or scan becomes precise, editable CAD geometry.</p></li>
              <li className="wstep reveal"><b>Phase 02</b><h4>Major DFM implemented</h4><p>The design is optimized for real manufacturing and assembly.</p></li>
              <li className="wstep reveal"><b>Phase 03</b><h4>Complete BOM specified</h4><p>Every component, fastener and material is accounted for.</p></li>
              <li className="wstep reveal"><b>Phase 04</b><h4>Calculations &amp; simulations</h4><p>All necessary engineering checks and fit studies performed.</p></li>
              <li className="wstep reveal"><b>Phase 05</b><h4>Ready for physical prototyping</h4><p>Print-ready models with fully dimensioned drawings.</p></li>
            </ol>
          </div>

          <aside className="wf-visual" id="wfVisual">
            <div className="wf-visual__card">
              <div className="wf-visual__media" id="wfMedia">
                {/* eslint-disable @next/next/no-img-element */}
                <img src="/projects/portfolio/pump-0.jpg" alt="CAD geometry" className="active" />
                <img src="/projects/coolingstation.jpg" alt="Design optimized for manufacturing" />
                <img src="/projects/bom.jpg" alt="Exploded view with bill of materials" />
                <img src="/projects/foam.jpg" alt="Cross-section fit study" />
                <img src="/projects/impeller.jpg" alt="Printed prototype part" />
                {/* eslint-enable @next/next/no-img-element */}
              </div>
              <div className="wf-visual__body">
                <div className="wf-visual__top">
                  <span className="wf-visual__num"><b id="wfNum">01</b> / 05</span>
                  <span className="wf-visual__ex" id="wfEx">Centrifugal Pump</span>
                </div>
                <span className="wf-visual__label" id="wfLabel">Detailed 3D design + engineering</span>
                <p className="wf-visual__desc" id="wfDesc">Sketches, scans or old 2D drawings become precise, fully editable CAD geometry.</p>
                <div className="wf-visual__bar"><span id="wfBar"></span></div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--tight">
        <div className="split reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="split__media"><img src="/projects/mixer.jpg" alt="Two-component glue mixer" /></div>
          <div className="split__body">
            <h3>Materials &amp; tools we reach for</h3>
            <p>We model in SolidWorks and Autodesk Inventor, run parametric drawing sets, and print in PET-G, ABS and ABS+ depending on the load. From a helical two-component mixer to a 600&nbsp;mm-tall statue at 0.1&nbsp;mm layers, we match the process to the part.</p>
            <Link className="btn btn--ghost" href="/projects">Browse the catalogue</Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__orb"></div>
        <div className="cta__inner">
          <h2 className="cta__title reveal-mask"><span>Work with <em>us</em>.</span></h2>
          <p className="reveal">Tell us about your project — we&apos;ll come back with cost and timing estimates.</p>
          <Link className="btn btn--big reveal" href="/contact">Get in touch</Link>
        </div>
      </section>
    </main>
  );
}
