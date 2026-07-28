"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover:none)").matches) return;
    const c = ring.current!;
    const d = dot.current!;
    let cx = 0,
      cy = 0,
      dx = 0,
      dy = 0,
      raf = 0;

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      d.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      cx += (dx - cx) * 0.15;
      cy += (dy - cy) * 0.15;
      c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();

    const sel = "a,button,.card,.project,.pcard,.filter";
    const over = () => c.classList.add("hover");
    const out = () => c.classList.remove("hover");
    const bind = () =>
      document.querySelectorAll(sel).forEach((el) => {
        el.addEventListener("mouseenter", over);
        el.addEventListener("mouseleave", out);
      });
    bind();
    // re-bind when the DOM changes (route changes, grids render)
    const mo = new MutationObserver(() => bind());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor" ref={ring} />
      <div className="cursor-dot" id="cursorDot" ref={dot} />
    </>
  );
}
