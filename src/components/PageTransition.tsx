"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Slide-up overlay that plays out on every route change. */
export default function PageTransition() {
  const el = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const ov = el.current!;
    ov.classList.remove("out");
    ov.classList.add("in");
    const t = setTimeout(() => {
      ov.classList.remove("in");
      ov.classList.add("out");
    }, 60);
    return () => clearTimeout(t);
  }, [pathname]);

  return <div className="page-trans out" ref={el} aria-hidden="true" />;
}
