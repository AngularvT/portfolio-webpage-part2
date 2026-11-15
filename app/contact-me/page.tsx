import type { Metadata } from "next";
import ContactApiForm from "./contact-api-form";
import styles from "./contact-api.module.css";

export const metadata: Metadata = {
  title: "Contact (API) — Lanboer Zhao",
};

export default function ContactApiPage() {
  return (
    <div className={styles.page}>
      <h1>Contact me</h1>
      <p>
        Send me a message using the form below. This form submits as JSON with
        fetch to <code>POST /api/contacts</code> (also available at{" "}
        <code>POST /api/contact</code>), is validated on the server, and is
        saved to the same JSON file as the server-action form on the Contact
        page.
      </p>
      <ContactApiForm />
    </div>
  );
}
