import type { Metadata } from "next";
import Link from "next/link";
import BlogAdminForm from "./blog-admin-form";
import styles from "./blog-admin.module.css";

export const metadata: Metadata = {
  title: "Blog admin — Lanboer Zhao",
};

export default function BlogAdminPage() {
  return (
    <div className={styles.page}>
      <h1>Publish a blog post</h1>
      <p>
        Write a title and the post, then hit Publish. The post is validated on
        the server, gets a unique slug, and is saved to the blog data file.
        Published posts appear on the{" "}
        <Link href="/blogs" className={styles.link}>
          blog list
        </Link>
        .
      </p>
      <BlogAdminForm />
    </div>
  );
}
