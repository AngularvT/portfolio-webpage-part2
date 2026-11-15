"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { BlogApiResponse } from "@/lib/blogs-request";
import type { BlogFieldErrors } from "@/lib/blogs-request";
import styles from "./blog-admin.module.css";

type AdminFormState = {
  status: "idle" | "success" | "validation-error" | "request-error" | "save-error";
  message: string;
  fieldErrors: BlogFieldErrors;
  savedSlug?: string;
};

const idleState: AdminFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export default function BlogAdminForm() {
  const [state, setState] = useState<AdminFormState>(idleState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    setState(idleState);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          body: formData.get("body"),
        }),
      });
      const result = (await response.json()) as BlogApiResponse;

      if (response.ok && result.status === "success") {
        setState({
          status: "success",
          message: result.message,
          fieldErrors: {},
          savedSlug: result.post.slug,
        });
        form.reset();
      } else if (result.status === "validation-error") {
        setState({
          status: "validation-error",
          message: result.message,
          fieldErrors: result.fieldErrors,
        });
      } else if (
        result.status === "request-error" ||
        result.status === "save-error"
      ) {
        setState({
          status: result.status,
          message: result.message,
          fieldErrors: {},
        });
      } else {
        setState({
          status: "save-error",
          message: "Sorry — something went wrong. Please try again in a moment.",
          fieldErrors: {},
        });
      }
    } catch {
      setState({
        status: "request-error",
        message:
          "Sorry — we could not reach the server. Please check your connection and try again.",
        fieldErrors: {},
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {state.status === "success" && (
        <p role="status" className={styles.success}>
          {state.message}{" "}
          {state.savedSlug && (
            <>
              Read it at{" "}
              <Link href={`/blogs/${state.savedSlug}`} className={styles.link}>
                /blogs/{state.savedSlug}
              </Link>{" "}
              or{" "}
              <Link href="/blogs" className={styles.link}>
                see all posts
              </Link>
              .
            </>
          )}
        </p>
      )}
      {(state.status === "save-error" || state.status === "request-error") && (
        <p role="alert" className={styles.saveError}>
          {state.message}
        </p>
      )}
      {state.status === "validation-error" && (
        <p role="alert" className={styles.formError}>
          {state.message}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="blog-title">Title</label>
        <input
          id="blog-title"
          name="title"
          type="text"
          required
          aria-invalid={state.fieldErrors.title ? true : undefined}
          aria-describedby={
            state.fieldErrors.title ? "blog-title-error" : undefined
          }
        />
        {state.fieldErrors.title && (
          <p id="blog-title-error" className={styles.fieldError}>
            {state.fieldErrors.title}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="blog-body">Post</label>
        <textarea
          id="blog-body"
          name="body"
          rows={12}
          required
          aria-invalid={state.fieldErrors.body ? true : undefined}
          aria-describedby={
            state.fieldErrors.body ? "blog-body-error" : undefined
          }
        />
        {state.fieldErrors.body && (
          <p id="blog-body-error" className={styles.fieldError}>
            {state.fieldErrors.body}
          </p>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}
