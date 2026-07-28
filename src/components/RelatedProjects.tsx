import Link from "next/link";
import type { Project } from "@/lib/types";
import { catLabel } from "@/lib/types";
import { projectCover } from "@/lib/project-images";

export default function RelatedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="related">
      <div className="related__head">
        <span className="section__tag">More work</span>
        <h2 className="related__title">Related projects</h2>
      </div>
      <div className="related__grid">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="related__card">
            <div className="related__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={projectCover(p)} alt={p.name} loading="lazy" />
            </div>
            <div className="related__body">
              <span className="related__cat">{catLabel(p.category)}</span>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="related__more">
        <Link className="btn btn--ghost" href="/projects">Browse all projects</Link>
      </div>
    </section>
  );
}
