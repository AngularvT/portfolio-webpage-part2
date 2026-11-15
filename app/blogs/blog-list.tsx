"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./blogs.module.css";

type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
};

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data: { posts?: BlogPost[] }) => {
        if (!cancelled) {
          setPosts(data.posts ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <p role="alert" className={styles.loadError}>
        Posts could not be loaded. Refresh the page to try again.
      </p>
    );
  }

  if (posts === null) {
    return <p className={styles.loading}>Loading posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <p className={styles.empty}>
        No posts yet. Publish one from{" "}
        <Link href="/admin/blogs" className={styles.adminLink}>
          the blog admin page
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.card}>
          <h2>
            <Link href={`/blogs/${post.slug}`} className={styles.postLink}>
              {post.title}
            </Link>
          </h2>
          <time className={styles.date} dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </li>
      ))}
    </ul>
  );
}
