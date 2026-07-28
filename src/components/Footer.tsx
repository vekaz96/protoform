import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        PROTO<em>FORM</em>
        <p>
          3D modeling, CAD engineering and prototype development — from idea to
          physical part.
        </p>
      </div>
      <div className="footer__col">
        <h4>Pages</h4>
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <div className="footer__col">
        <h4>Get in touch</h4>
        <a href="mailto:hello@protoform.example">hello@protoform.example</a>
        <Link href="/contact">Request a quote</Link>
      </div>
      <div className="footer__base">
        <span>© 2026 PROTOFORM</span>
        <span>All models shown are our own past projects</span>
      </div>
    </footer>
  );
}
