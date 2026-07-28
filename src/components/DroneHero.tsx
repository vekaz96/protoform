"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  { p: 0, label: "Complete airframe" },
  { p: 15, label: "Components separate" },
  { p: 30, label: "Full exploded view" },
  { p: 45, label: "Inside the FC & ESC stack" },
  { p: 60, label: "Motors, props & fasteners" },
  { p: 70, label: "Camera & gimbal detail" },
  { p: 80, label: "Components converge" },
  { p: 90, label: "Frame closes up" },
  { p: 100, label: "Assembled — ready to fly" },
];

export default function DroneHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pctRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ready = false;
    let duration = 0;

    const applyUI = (t: number) => {
      if (pctRef.current) pctRef.current.textContent = String(Math.round(t * 100));
      if (railRef.current) railRef.current.style.height = `${t * 100}%`;
      let active = 0;
      for (let i = 0; i < STAGES.length; i++) if (t >= STAGES[i].p / 100 - 0.001) active = i;
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        el.classList.toggle("on", i === active);
        el.classList.toggle("done", i < active);
      });
    };

    const seekTo = (t: number) => {
      if (!ready) return;
      const clamped = Math.min(Math.max(t, 0), duration - 0.03);
      try {
        video.currentTime = clamped;
      } catch {}
    };
    const setProgress = (p: number) => {
      applyUI(p);
      seekTo(p * duration);
    };

    const onMeta = () => {
      if (ready) return;
      duration = video.duration;
      if (!isFinite(duration) || duration <= 0) return;
      ready = true;
      video.classList.add("is-ready");
      try {
        video.currentTime = 0;
      } catch {}
    };
    video.muted = true;
    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);

    // iOS: prime once on first touch so a paused <video> will seek
    const prime = () => {
      window.removeEventListener("touchstart", prime);
      const pr = video.play();
      if (pr && (pr as Promise<void>).then) (pr as Promise<void>).then(() => video.pause()).catch(() => {});
    };
    window.addEventListener("touchstart", prime, { passive: true });

    // seekability guard
    const checkSeekable = () => {
      video.removeEventListener("canplay", checkSeekable);
      setTimeout(() => {
        const ok = video.seekable && video.seekable.length && video.seekable.end(0) > 0.1;
        if (!ok) console.warn("[hero] video not seekable — server must support HTTP Range requests.");
      }, 300);
    };
    video.addEventListener("canplay", checkSeekable);

    let trigger: ScrollTrigger | undefined;
    if (reduced) {
      const hold = () => {
        try {
          video.currentTime = Math.max(0, video.duration - 0.05);
        } catch {}
      };
      if (video.readyState >= 1) hold();
      else video.addEventListener("loadedmetadata", hold);
      applyUI(1);
    } else {
      trigger = ScrollTrigger.create({
        trigger: "#dhero",
        start: "top top",
        end: "+=" + (window.innerWidth < 820 ? 320 : 460) + "%",
        pin: "#dstage",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      });
    }
    applyUI(0);

    // intro reveal of the hero copy — fromTo (explicit ends) so it stays
    // correct even when React Strict Mode double-invokes the effect in dev.
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".hero__title .line>span", { y: "110%" }, { y: "0%", duration: 1.1, stagger: 0.12 })
      .fromTo(".hero__kicker>span", { y: "110%" }, { y: "0%", duration: 0.8 }, "-=.9")
      .fromTo(".hero__sub>span", { y: "110%" }, { y: "0%", duration: 0.8 }, "-=.7")
      .fromTo(".hero__cta>span", { y: "110%" }, { y: "0%", duration: 0.8 }, "-=.7")
      .fromTo(".dstages", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.9 }, "-=.8")
      .fromTo(".dhero__pct", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=.7");

    return () => {
      window.removeEventListener("touchstart", prime);
      video.removeEventListener("loadedmetadata", onMeta);
      trigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="dhero" id="dhero">
      <div className="dstage" id="dstage">
        <video
          id="droneVideo"
          className="dstage__video"
          ref={videoRef}
          src="/drone-assembly.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        />

        <div className="dhero__copy">
          <p className="hero__kicker reveal-line">
            <span>Engineering studio · CAD · Prototyping</span>
          </p>
          <h1 className="hero__title">
            <span className="line"><span>EVERY PART,</span></span>
            <span className="line"><span>ENGINEERED</span></span>
            <span className="line line--accent"><span>TO FIT</span></span>
          </h1>
          <p className="hero__sub reveal-line">
            <span>
              Scroll to take it apart. Exploded views, tolerances and assemblies —
              exactly how we deliver your product.
            </span>
          </p>
          <div className="hero__cta reveal-line">
            <span>
              <Link className="btn" href="/projects">See our work</Link>
              <Link className="btn btn--ghost" href="/contact">Start a project</Link>
            </span>
          </div>
        </div>

        <div className="dstages" aria-hidden="true">
          <div className="dstages__rail">
            <span ref={railRef} />
          </div>
          <ol className="dstages__list">
            {STAGES.map((s, i) => (
              <li
                key={s.p}
                className="dstage-item"
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
              >
                <b>{s.p}%</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="dhero__pct">
          <b ref={pctRef}>0</b>
          <i>%</i>
          <em>sequence</em>
        </div>
        <div className="dhero__hint">
          <span></span>scroll to explore
        </div>
      </div>
    </section>
  );
}
