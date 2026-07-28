import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects, getRelatedProjects } from "@/lib/queries";
import { catLabel } from "@/lib/types";
import { projectImages } from "@/lib/project-images";
import ProjectGallery from "@/components/ProjectGallery";
import RelatedProjects from "@/components/RelatedProjects";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project — PROTOFORM" };
  return {
    title: `${project.name} — PROTOFORM`,
    description: project.blurb,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const [images, related] = await Promise.all([
    Promise.resolve(projectImages(project)),
    getRelatedProjects(params.slug, 3),
  ]);

  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <Link className="article__back" href="/projects">← Back to projects</Link>
          <span className="subhero__tag">{catLabel(project.category)}</span>
          <h1 className="subhero__title">
            <span className="line"><span>{project.name}</span></span>
          </h1>
          <p className="subhero__lead">{project.blurb}</p>
          {project.tags.length > 0 && (
            <div className="project__tags">
              {project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="project">
        <ProjectGallery images={images} name={project.name} />
      </section>

      <RelatedProjects projects={related} />

      <section className="cta">
        <div className="cta__orb"></div>
        <div className="cta__inner">
          <h2 className="cta__title reveal-mask">
            <span>Need something like this?</span>
          </h2>
          <p className="reveal">Tell us what you need — we&apos;ll come back with cost and timing estimates.</p>
          <div className="project__cta-row reveal">
            <Link className="btn btn--big" href="/contact">Start a project</Link>
            <Link className="btn btn--ghost" href="/projects">More projects</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
