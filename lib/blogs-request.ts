import {
  readBlogPosts,
  saveBlogPost,
  type StoredBlogPost,
} from "./blogs-store";

export type BlogFieldErrors = {
  title?: string;
  body?: string;
};

export type BlogApiResponse =
  | {
      status: "success";
      message: string;
      post: { slug: string; title: string };
    }
  | { status: "validation-error"; message: string; fieldErrors: BlogFieldErrors }
  | { status: "request-error"; message: string }
  | { status: "save-error"; message: string };

export async function handleBlogsGet(): Promise<Response> {
  let posts: StoredBlogPost[];
  try {
    posts = readBlogPosts();
  } catch {
    return Response.json(
      {
        status: "request-error",
        message: "Blog posts could not be loaded.",
      } satisfies BlogApiResponse,
      { status: 500 },
    );
  }
  return Response.json({ posts });
}

export async function handleBlogsPost(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        status: "request-error",
        message: "The request body must be valid JSON.",
      } satisfies BlogApiResponse,
      { status: 400 },
    );
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return Response.json(
      {
        status: "request-error",
        message:
          "The request body must be a JSON object with title and body fields.",
      } satisfies BlogApiResponse,
      { status: 400 },
    );
  }

  const record = payload as Record<string, unknown>;
  const { title, body: postBody } = record;
  const fieldErrors: BlogFieldErrors = {};

  if (typeof title !== "string") {
    fieldErrors.title =
      title === undefined ? "Title is required." : "Title must be text.";
  }
  if (typeof postBody !== "string") {
    fieldErrors.body =
      postBody === undefined ? "Body is required." : "Body must be text.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      {
        status: "validation-error",
        message: "Please fix the errors and try again.",
        fieldErrors,
      } satisfies BlogApiResponse,
      { status: 400 },
    );
  }

  const trimmedTitle = (title as string).trim();
  const trimmedBody = (postBody as string).trim();

  if (trimmedTitle.length === 0) {
    fieldErrors.title = "Title is required.";
  }
  if (trimmedBody.length === 0) {
    fieldErrors.body = "Body is required.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      {
        status: "validation-error",
        message: "Please fix the errors and try again.",
        fieldErrors,
      } satisfies BlogApiResponse,
      { status: 400 },
    );
  }

  try {
    const post = saveBlogPost(trimmedTitle, trimmedBody);
    return Response.json(
      {
        status: "success",
        message: `Post "${post.title}" saved.`,
        post: { slug: post.slug, title: post.title },
      } satisfies BlogApiResponse,
      { status: 201 },
    );
  } catch {
    return Response.json(
      {
        status: "save-error",
        message:
          "Sorry — the post could not be saved. Please try again in a moment.",
      } satisfies BlogApiResponse,
      { status: 500 },
    );
  }
}
