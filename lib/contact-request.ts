import { saveSubmission, type StoredSubmission } from "./submissions-store";
import {
  validateContactInput,
  type ContactFieldErrors,
} from "./contact-validation";

export type ContactApiResponse =
  | { status: "success"; message: string }
  | {
      status: "validation-error";
      message: string;
      fieldErrors: ContactFieldErrors;
    }
  | { status: "request-error"; message: string }
  | { status: "save-error"; message: string };

export async function handleContactPost(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        status: "request-error",
        message: "The request body must be valid JSON.",
      } satisfies ContactApiResponse,
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json(
      {
        status: "request-error",
        message:
          "The request body must be a JSON object with name, email, and message fields.",
      } satisfies ContactApiResponse,
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const { name, email, message } = record;
  const fieldErrors: ContactFieldErrors = {};

  if (typeof name !== "string") {
    fieldErrors.name =
      name === undefined ? "Name is required." : "Name must be text.";
  }
  if (typeof email !== "string") {
    fieldErrors.email =
      email === undefined ? "Email is required." : "Email must be text.";
  }
  if (typeof message !== "string") {
    fieldErrors.message =
      message === undefined ? "Message is required." : "Message must be text.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      {
        status: "validation-error",
        message: "Please fix the errors and try again.",
        fieldErrors,
      } satisfies ContactApiResponse,
      { status: 400 },
    );
  }

  const result = validateContactInput({
    name: name as string,
    email: email as string,
    message: message as string,
  });

  if (!result.ok) {
    return Response.json(
      {
        status: "validation-error",
        message: "Please fix the errors and try again.",
        fieldErrors: result.errors,
      } satisfies ContactApiResponse,
      { status: 400 },
    );
  }

  const submission: StoredSubmission = {
    name: result.name,
    email: result.email,
    message: result.message,
    submittedAt: new Date().toISOString(),
  };

  try {
    saveSubmission(submission);
  } catch {
    return Response.json(
      {
        status: "save-error",
        message:
          "Sorry — your message could not be saved. Please try again in a moment.",
      } satisfies ContactApiResponse,
      { status: 500 },
    );
  }

  return Response.json(
    {
      status: "success",
      message: `Thanks, ${submission.name}! Your message has been received.`,
    } satisfies ContactApiResponse,
    { status: 201 },
  );
}
