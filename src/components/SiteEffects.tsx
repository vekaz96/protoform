"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Port of the static site's shared scroll effects: reveals, count-ups,
   masked titles, the workflow line, section-tag parallax and the sticky
   workflow visual panel. Re-runs on every route change and only kills the
   triggers it created (the drone hero manages its own). */

/* The corner tag names the deliverable, not a past project — the panel is about
   what you receive at each phase, and the work itself lives on /projects. */
const WF_PHASES = [
  { ex: "STEP · IGES · native CAD", label: "Detailed 3D design + engineering",
    desc: "Sketches, scans or old 2D drawings become precise, fully editable CAD geometry." },
  { ex: "Draft · ribs · wall thickness", label: "Major DFM implemented",
    desc: "Draft angles, ribs and wall thickness are set so the part can actually be made — and made affordably." },
  { ex: "Parts · materials · weights", label: "Complete BOM specified",
    desc: "Every part, fastener, material and weight listed and costed against the assembly." },
  { ex: "FEA · fit studies", label: "Calculations & simulations",
    desc: "Loads, stresses and clearances are proven in software before anything is cut or printed." },
  { ex: "STL · dimensioned DWG", label: "Ready for physical prototyping",
    desc: "Print-ready models with dimensioned drawings — then the real part in your hand." },
];

export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const created: ScrollTrigger[] = [];
    let wfTimer = 0;
    const track = (t: ScrollTrigger | undefined) => {
      if (t) created.push(t);
    };

    // let the DOM settle (route change / hydration)
    const id = window.setTimeout(() => {
      // generic reveals
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        track(
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            onEnter: () => el.classList.add("in"),
          })
        );
      });
      // masked titles
      gsap.utils.toArray<HTMLElement>(".reveal-mask>span").forEach((span) => {
        const tw = gsap.to(span, {
          y: "0%",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: span, start: "top 92%" },
        });
        track(tw.scrollTrigger as ScrollTrigger);
      });
      // subhero titles animate straight in
      gsap.to(".subhero__title .line>span", {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.2,
      });
      // count-ups
      gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
        const target = +(el.dataset.count || "0");
        track(
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () => {
              gsap.to(
                { v: 0 },
                {
                  v: target,
                  duration: 1.6,
                  ease: "power2.out",
                  onUpdate() {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    el.textContent = String(Math.floor((this as any).targets()[0].v));
                  },
                }
              );
            },
          })
        );
      });
      // workflow line fill
      const wfLine = document.getElementById("wfLine");
      if (wfLine) {
        const tw = gsap.to(wfLine, {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".workflow__timeline",
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        });
        track(tw.scrollTrigger as ScrollTrigger);
      }
      // section-tag parallax
      gsap.utils.toArray<HTMLElement>(".section").forEach((sec) => {
        const tag = sec.querySelector<HTMLElement>(".section__tag");
        if (!tag) return;
        const tw = gsap.fromTo(
          tag,
          { y: 20 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        track(tw.scrollTrigger as ScrollTrigger);
      });

      // sticky workflow visual panel
      const wfMedia = document.getElementById("wfMedia");
      if (wfMedia) {
        const imgs = Array.from(wfMedia.querySelectorAll<HTMLElement>("[data-phase]"));
        const steps = gsap.utils.toArray<HTMLElement>(".wstep");
        const num = document.getElementById("wfNum");
        const lab = document.getElementById("wfLabel");
        const des = document.getElementById("wfDesc");
        const ex = document.getElementById("wfEx");
        const bar = document.getElementById("wfBar");
        let activeI = -1;
        const applyPhase = (i: number) => {
          activeI = i;
          imgs.forEach((im, k) => im.classList.toggle("active", k === i));
          steps.forEach((s, k) => {
            s.classList.toggle("current", k === i);
            s.classList.toggle("dim", k !== i);
          });
          const p = WF_PHASES[i];
          if (num) num.textContent = String(i + 1).padStart(2, "0");
          if (lab) lab.textContent = p.label;
          if (des) des.textContent = p.desc;
          if (ex) ex.textContent = p.ex;
          if (bar) (bar as HTMLElement).style.width = `${((i + 1) / WF_PHASES.length) * 100}%`;
          if (lab && des)
            gsap.fromTo([lab, des], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.05 });
        };

        /*
         * The phases are driven by scroll position, so a single flick used to
         * fire several of them in a few hundred milliseconds and the crossfade
         * never finished — it read as a strobe. Hold each phase for MIN_DWELL
         * and coalesce anything that arrives inside that window, so a fast
         * scroll lands on the phase you stopped at instead of flashing through
         * every one on the way.
         */
        const MIN_DWELL = 420;
        let shownAt = 0;
        let queued: number | null = null;
        /*
         * Nothing runs until the whole visual panel is on screen. Entering the
         * section from the top used to start — and often finish — phase 01's
         * draw-in while the panel was still half below the fold, so the first
         * thing you actually saw was already over.
         */
        let armed = false;
        let lastRequested = 0;
        const setPhase = (i: number) => {
          if (i < 0 || i >= WF_PHASES.length) return;
          lastRequested = i;
          if (!armed || i === activeI) return;
          queued = i;
          window.clearTimeout(wfTimer);
          const wait = Math.max(0, MIN_DWELL - (performance.now() - shownAt));
          wfTimer = window.setTimeout(() => {
            if (queued === null || queued === activeI) return;
            shownAt = performance.now();
            applyPhase(queued);
            queued = null;
          }, wait);
        };

        steps.forEach((s, i) => {
          track(
            ScrollTrigger.create({
              trigger: s,
              start: "top 65%",
              end: "bottom 45%",
              onEnter: () => setPhase(i),
              onEnterBack: () => setPhase(i),
            })
          );
          // clicking a step scrolls it into its own active band, which sets the
          // phase through the same trigger — no second source of truth.
          s.addEventListener("click", () => s.scrollIntoView({ behavior: "smooth", block: "center" }));
        });

        const card = document.querySelector<HTMLElement>(".wf-visual__card");
        const arm = () => {
          if (armed) return;
          armed = true;
          wfMedia.classList.add("is-armed");
          applyPhase(lastRequested);
        };
        if (card) {
          // A panel taller than the viewport can never be "fully visible", so
          // fall back to arming as its top reaches the top of the screen.
          const tooTall = card.offsetHeight > window.innerHeight - 120;
          const box = card.getBoundingClientRect();
          if (tooTall ? box.top <= 100 : box.bottom <= window.innerHeight - 16) {
            arm();
          } else {
            track(
              ScrollTrigger.create({
                trigger: card,
                start: tooTall ? "top top+=100" : "bottom bottom-=16",
                once: true,
                onEnter: arm,
              })
            );
          }
        } else {
          arm();
        }
      }

      ScrollTrigger.refresh();
    }, 80);

    return () => {
      window.clearTimeout(id);
      window.clearTimeout(wfTimer);
      created.forEach((t) => t.kill());
    };
  }, [pathname]);

  return null;
}
