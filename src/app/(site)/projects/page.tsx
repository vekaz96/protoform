import Link from "next/link";
import { getProjects } from "@/lib/queries";
import ProjectsGrid from "@/components/ProjectsGrid";

export const revalidate = 60;

export const metadata = {
  title: "Projects — PROTOFORM",
  description:
    "The full PROTOFORM project catalogue — mechanical engineering, product design and 3D printing.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <span className="subhero__tag">Portfolio · {projects.length} projects</span>
          <h1 className="subhero__title">
            <span className="line"><span>Selected <em>work</em></span></span>
          </h1>
          <p className="subhero__lead">
            Every project below is our own past work — sorted by discipline, from
            production machinery and mechanical assemblies to consumer product design
            and reverse-engineered 3D-printed parts. Click any card for the detail.
          </p>
        </div>
      </section>

      <ProjectsGrid projects={projects} />

      <section className="cta">
        <div className="cta__orb"></div>
        <div className="cta__inner">
          <h2 className="cta__title reveal-mask">
            <span>Don&apos;t see your part?<br />We&apos;ve probably <em>built one like it</em>.</span>
          </h2>
          <p className="reveal">Tell us what you need — we&apos;ll come back with cost and timing estimates.</p>
          <Link className="btn btn--big reveal" href="/contact">Start a project</Link>
        </div>
      </section>
    </main>
  );
}
