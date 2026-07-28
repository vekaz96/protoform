import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getPost, getPosts } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post — PROTOFORM" };
  return { title: `${post.title} — PROTOFORM`, description: post.excerpt };
}

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const html = marked.parse(post.body, { async: false }) as string;

  return (
    <main>
      <section className="subhero">
        <div className="subhero__orb"></div>
        <div className="subhero__inner">
          <Link className="article__back" href="/blog">← Back to journal</Link>
          <span className="subhero__tag">{fmt(post.created_at)}</span>
          <h1 className="subhero__title"><span className="line"><span>{post.title}</span></span></h1>
          <p className="subhero__lead">{post.excerpt}</p>
        </div>
      </section>

      <article className="article">
        {post.cover_url && (
          <div className="article__cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_url} alt={post.title} />
          </div>
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
