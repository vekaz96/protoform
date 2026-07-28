"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // dark text while the transparent nav sits over the light hero band (home, at top)
  const light = isHome && !scrolled;

  const cls = [
    "nav",
    scrolled ? "scrolled" : "",
    light ? "nav--light" : "",
    open ? "menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={cls} id="nav">
      <Link className="nav__logo" href="/">
        PROTO<em>FORM</em>
      </Link>
      <nav className={`nav__links${open ? " open" : ""}`} id="navLinks">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={active(l.href) ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link className="btn btn--small" href="/contact">
        Request a quote
      </Link>
      <button
        className="nav__burger"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
