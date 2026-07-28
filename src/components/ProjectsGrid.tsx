"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, catLabel, type Project } from "@/lib/types";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<string>("all");
  const [active, setActive] = useState<Project | null>(null);

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
            onClick={() => setActive(p)}
          >
            <div className="pcard__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.name} loading="lazy" />
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
            {active && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.image_url} alt={active.name} />
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
