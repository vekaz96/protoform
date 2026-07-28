import Link from "next/link";
import { getPosts } from "@/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Blog — PROTOFORM",
  description: "Build notes, material choices and stories from the workshop.",
};

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <span className="subhero__tag">Journal · {posts.length} posts</span>
          <h1 className="subhero__title"><span className="line"><span>From the <em>workshop</em></span></span></h1>
          <p className="subhero__lead">Build notes, material choices and the odd war story from the bench — how we take an idea and turn it into a real, manufacturable part.</p>
        </div>
      </section>

      {posts.length === 0 ? (
        <p className="blogempty">No posts yet — check back soon.</p>
      ) : (
        <div className="bloggrid">
          {posts.map((p) => (
            <Link className="postcard" key={p.slug} href={`/blog/${p.slug}`}>
              {p.cover_url && (
                <div className="postcard__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover_url} alt={p.title} loading="lazy" />
                </div>
              )}
              <div className="postcard__body">
                <span className="postcard__date">{fmt(p.created_at)}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="postcard__more">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
