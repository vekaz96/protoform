import Link from "next/link";
import DroneHero from "@/components/DroneHero";

export default function Home() {
  return (
    <main id="top">
      <DroneHero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>CAD Engineering — 3D Printing — Simulation — DFM — Rapid Prototyping — Product Design — </span>
          <span>CAD Engineering — 3D Printing — Simulation — DFM — Rapid Prototyping — Product Design — </span>
        </div>
      </div>

      <section className="section abilities" id="abilities">
        <div className="section__head">
          <span className="section__tag reveal">Abilities</span>
          <h2 className="section__title reveal-mask">
            <span>A team of engineers,<br />one <em>CAD approach</em>.</span>
          </h2>
        </div>
        <div className="abilities__grid">
          <p className="abilities__text reveal">
            We assist you as a team of engineers in product development through a CAD
            approach — 3D modeling, mechanical design and prototype development via 3D
            printing. We come from different departments and speak different languages,
            but we partner to solve our customers&apos; problems with the most amazing
            simulation solutions available.
          </p>
          <div className="stats">
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="250">0</span>+</span><span className="stat__label">Total projects, worldwide clients</span></div>
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="37">0</span></span><span className="stat__label">Projects in this portfolio</span></div>
            <div className="stat reveal"><span className="stat__num"><span className="count" data-count="40">0</span></span><span className="stat__label">Long-term engagements</span></div>
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

      <section className="section services" id="services">
        <div className="section__head">
          <span className="section__tag reveal">Services</span>
          <h2 className="section__title reveal-mask"><span>What we <em>build</em> for you</span></h2>
        </div>
        <div className="services__grid">
          <article className="card reveal"><span className="card__index">01</span><h3>3D Modeling &amp; CAD Engineering</h3><p>Detailed 3D design and engineering of parts and assemblies — from concept geometry to manufacturing-ready models with full technical drawings.</p></article>
          <article className="card reveal"><span className="card__index">02</span><h3>Simulation &amp; DFM</h3><p>All necessary calculations and simulations performed, major design-for-manufacturing decisions implemented, and a complete bill of materials specified.</p></article>
          <article className="card reveal"><span className="card__index">03</span><h3>3D Printing &amp; Prototyping</h3><p>Designs made ready for physical prototyping — printed in PET-G and other materials, including replacement parts you can&apos;t buy anywhere.</p></article>
        </div>
        <div style={{ marginTop: "2.5rem" }} className="reveal">
          <Link className="btn btn--ghost" href="/services">Explore services</Link>
        </div>
      </section>

      <section className="section workflow" id="workflow">
        <div className="section__head">
          <span className="section__tag reveal">Project workflow</span>
          <h2 className="section__title reveal-mask"><span>Five deliverables,<br />one <em>clear path</em></span></h2>
        </div>
        <div className="workflow__grid">
          <div className="workflow__timeline">
            <div className="workflow__line"><span id="wfLine"></span></div>
            <ol className="workflow__steps">
              <li className="wstep reveal"><b>Phase 01</b><h4>Detailed 3D design + engineering</h4><p>Your idea becomes precise, editable CAD geometry.</p></li>
              <li className="wstep reveal"><b>Phase 02</b><h4>Major DFM implemented</h4><p>The design is optimized for real manufacturing.</p></li>
              <li className="wstep reveal"><b>Phase 03</b><h4>Complete BOM specified</h4><p>Every component and material accounted for.</p></li>
              <li className="wstep reveal"><b>Phase 04</b><h4>Calculations &amp; simulations</h4><p>All necessary engineering checks performed.</p></li>
              <li className="wstep reveal"><b>Phase 05</b><h4>Ready for physical prototyping</h4><p>Print-ready models with dimensioned drawings.</p></li>
            </ol>
          </div>

          <aside className="wf-visual" id="wfVisual">
            <div className="wf-visual__card">
              <div className="wf-visual__media" id="wfMedia">
                {/* eslint-disable @next/next/no-img-element */}
                <img src="/projects/pump.jpg" alt="CAD geometry" className="active" />
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

      <section className="cta">
        <div className="cta__orb"></div>
        <div className="cta__inner">
          <h2 className="cta__title reveal-mask"><span>Have a part in mind?<br />Let&apos;s <em>prototype it</em>.</span></h2>
          <p className="reveal">Send us your idea, sketch or STEP file — we&apos;ll come back with cost and timing estimates.</p>
          <Link className="btn btn--big reveal" href="/contact">Start a project</Link>
        </div>
      </section>
    </main>
  );
}
