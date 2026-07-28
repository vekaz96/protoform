"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, catLabel, type Project } from "@/lib/types";
import { projectCover, projectImages } from "@/lib/project-images";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<string>("all");

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
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="pcard"
            style={{ animationDelay: `${(i % 9) * 40}ms` }}
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
          </Link>
        ))}
      </div>
    </>
  );
}
