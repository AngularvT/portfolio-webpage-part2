import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type StoredBlogPost = {
  slug: string;
  title: string;
  body: string;
  publishedAt: string;
};

const blogsPath = path.join(process.cwd(), "data", "blogs.json");

export function readBlogPosts(): StoredBlogPost[] {
  if (!existsSync(blogsPath)) {
    return [];
  }
  const parsed = JSON.parse(readFileSync(blogsPath, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error("Blog file is malformed.");
  }
  return parsed;
}

export function getBlogBySlug(slug: string): StoredBlogPost | undefined {
  return readBlogPosts().find((post) => post.slug === slug);
}

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.length > 0 ? base : "post";
}

export function uniqueSlug(
  title: string,
  existing: StoredBlogPost[],
): string {
  const taken = new Set(existing.map((post) => post.slug));
  const base = slugifyTitle(title);
  let slug = base;
  let counter = 2;
  while (taken.has(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export function saveBlogPost(title: string, body: string): StoredBlogPost {
  const posts = readBlogPosts();
  const post: StoredBlogPost = {
    slug: uniqueSlug(title, posts),
    title,
    body,
    publishedAt: new Date().toISOString(),
  };
  posts.push(post);
  writeFileSync(blogsPath, JSON.stringify(posts, null, 2) + "\n", "utf8");
  return post;
}
