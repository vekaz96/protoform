import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — PROTOFORM",
  description: "Request a quote for 3D modeling, CAD engineering or 3D-printed prototypes.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <span className="subhero__tag">Contact</span>
          <h1 className="subhero__title"><span className="line"><span>Let&apos;s <em>prototype it</em></span></span></h1>
          <p className="subhero__lead">Send us your idea, sketch or STEP file and we&apos;ll come back with cost and timing estimates. The more detail you give, the sharper the estimate.</p>
        </div>
      </section>

      <div className="contact-grid">
        <ContactForm />
        <aside className="contact-info reveal">
          <h3>Get in touch</h3>
          <dl>
            <div><dt>Email</dt><dd><a href="mailto:hello@protoform.example">hello@protoform.example</a></dd></div>
            <div><dt>What to send</dt><dd>An idea, sketch, photo, scan or STEP/STL file.</dd></div>
            <div><dt>You&apos;ll get back</dt><dd>Cost and timing estimates, plus a recommended approach.</dd></div>
            <div><dt>Materials</dt><dd>PET-G, ABS, ABS+ and more, matched to the load.</dd></div>
          </dl>
        </aside>
      </div>

      <section className="cta">
        <div className="cta__orb"></div>
        <div className="cta__inner">
          <h2 className="cta__title reveal-mask"><span>Prefer to see the <em>work first</em>?</span></h2>
          <p className="reveal">Browse the full catalogue of past projects.</p>
          <Link className="btn btn--big reveal" href="/projects">View projects</Link>
        </div>
      </section>
    </main>
  );
}
