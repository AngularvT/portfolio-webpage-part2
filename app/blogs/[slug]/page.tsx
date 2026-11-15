import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogBySlug, readBlogPosts } from "@/lib/blogs-store";
import styles from "../blogs.module.css";

export const ensureStatic = "navigation";

export function generateStaticParams() {
  const posts = readBlogPosts();
  if (posts.length === 0) {
    return [{ slug: "__no_posts__" }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) {
    return { title: "Post not found — Lanboer Zhao" };
  }
  return { title: `${post.title} — Lanboer Zhao` };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.page}>
      <h1>{post.title}</h1>
      <time className={styles.date} dateTime={post.publishedAt}>
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <div className={styles.postBody}>{post.body}</div>
      <Link href="/blogs" className={styles.backLink}>
        ← Back to all posts
      </Link>
    </article>
  );
}
