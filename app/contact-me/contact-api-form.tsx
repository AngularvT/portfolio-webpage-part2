"use client";

import { useState, type FormEvent } from "react";
import type { ContactApiResponse } from "@/lib/contact-request";
import type { ContactFieldErrors } from "@/lib/contact-validation";
import styles from "./contact-api.module.css";

type ApiFormState = {
  status: "idle" | "success" | "validation-error" | "request-error" | "save-error";
  message: string;
  fieldErrors: ContactFieldErrors;
};

const idleState: ApiFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export default function ContactApiForm() {
  const [state, setState] = useState<ApiFormState>(idleState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    setState(idleState);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      const body = (await response.json()) as ContactApiResponse;

      if (response.ok && body.status === "success") {
        setState({
          status: "success",
          message: body.message,
          fieldErrors: {},
        });
        form.reset();
      } else if (body.status === "validation-error") {
        setState({
          status: "validation-error",
          message: body.message,
          fieldErrors: body.fieldErrors,
        });
      } else if (
        body.status === "request-error" ||
        body.status === "save-error"
      ) {
        setState({ status: body.status, message: body.message, fieldErrors: {} });
      } else {
        setState({
          status: "save-error",
          message:
            "Sorry — something went wrong. Please try again in a moment.",
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
          {state.message}
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
        <label htmlFor="api-contact-name">Name</label>
        <input
          id="api-contact-name"
          name="name"
          type="text"
          required
          aria-invalid={state.fieldErrors.name ? true : undefined}
          aria-describedby={
            state.fieldErrors.name ? "api-contact-name-error" : undefined
          }
        />
        {state.fieldErrors.name && (
          <p id="api-contact-name-error" className={styles.fieldError}>
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="api-contact-email">Email</label>
        <input
          id="api-contact-email"
          name="email"
          type="email"
          required
          aria-invalid={state.fieldErrors.email ? true : undefined}
          aria-describedby={
            state.fieldErrors.email ? "api-contact-email-error" : undefined
          }
        />
        {state.fieldErrors.email && (
          <p id="api-contact-email-error" className={styles.fieldError}>
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="api-contact-message">Message</label>
        <textarea
          id="api-contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={state.fieldErrors.message ? true : undefined}
          aria-describedby={
            state.fieldErrors.message ? "api-contact-message-error" : undefined
          }
        />
        {state.fieldErrors.message && (
          <p id="api-contact-message-error" className={styles.fieldError}>
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
