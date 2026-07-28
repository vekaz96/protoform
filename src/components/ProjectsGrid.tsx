"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, catLabel, type Project } from "@/lib/types";
import { projectCover, projectImages } from "@/lib/project-images";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<string>("all");
  const [active, setActive] = useState<Project | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeImages = useMemo(() => (active ? projectImages(active) : []), [active]);

  const openProject = (p: Project) => {
    setActive(p);
    setActiveIdx(0);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    projects.forEach((p) => (c[p.category] = (c[p.category] || 0) + 1));
    return c;
  }, [projects]);

  const filters = [
    { key: "all", label: "All work", n: projects.length },
    ...Object.keys(CATEGORIES).map((k) => ({
      key: k,
      label: CATEGORIES[k as keyof typeof CATEGORIES].label,
      n: counts[k] || 0,
    })),
  ];

  const visible = projects.filter((p) => cat === "all" || p.category === cat);

  const showPrev = () => setActiveIdx((i) => (i <= 0 ? activeImages.length - 1 : i - 1));
  const showNext = () => setActiveIdx((i) => (i >= activeImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="filters" id="filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter${cat === f.key ? " active" : ""}`}
            onClick={() => setCat(f.key)}
          >
            {f.label}
            <b>{f.n}</b>
          </button>
        ))}
      </div>

      <div className="pgrid" id="pgrid">
        {visible.map((p, i) => (
          <article
            key={p.slug}
            className="pcard"
            style={{ animationDelay: `${(i % 9) * 40}ms` }}
            onClick={() => openProject(p)}
          >
            <div className="pcard__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={projectCover(p)} alt={p.name} loading="lazy" />
              {projectImages(p).length > 1 && (
                <span className="pcard__count">+{projectImages(p).length - 1}</span>
              )}
            </div>
            <span className="pcard__cat">{catLabel(p.category)}</span>
            <div className="pcard__body">
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              <div className="pcard__tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className={`lightbox${active ? " open" : ""}`}
        id="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <button className="lightbox__close" aria-label="Close" onClick={() => setActive(null)}>
          ×
        </button>
        <div className="lightbox__inner">
          <div className="lightbox__img">
            {active && activeImages[activeIdx] && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeImages[activeIdx]} alt={active.name} />
                {activeImages.length > 1 && (
                  <>
                    <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image" onClick={showPrev}>
                      ‹
                    </button>
                    <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image" onClick={showNext}>
                      ›
                    </button>
                    <div className="lightbox__thumbs">
                      {activeImages.map((url, i) => (
                        <button
                          key={`${url}-${i}`}
                          type="button"
                          className={`lightbox__thumb${i === activeIdx ? " active" : ""}`}
                          aria-label={`Image ${i + 1}`}
                          onClick={() => setActiveIdx(i)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="lightbox__body">
            <span className="lightbox__cat">{active ? catLabel(active.category) : ""}</span>
            <h3>{active?.name}</h3>
            <p>{active?.blurb}</p>
            <div className="lightbox__tags">
              {active?.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
