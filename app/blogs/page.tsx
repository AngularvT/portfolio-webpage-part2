import type { Metadata } from "next";
import Link from "next/link";
import BlogList from "./blog-list";
import styles from "./blogs.module.css";

export const metadata: Metadata = {
  title: "Blog — Lanboer Zhao",
};

export default function BlogsPage() {
  return (
    <div className={styles.page}>
      <h1>Blog</h1>
      <p className={styles.intro}>
        Notes and write-ups. Posts are published from{" "}
        <Link href="/admin/blogs" className={styles.adminLink}>
          /admin/blogs
        </Link>{" "}
        and load from the blog API every time you open or refresh this page.
      </p>
      <BlogList />
    </div>
  );
}
