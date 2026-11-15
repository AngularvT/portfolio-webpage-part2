# Assignment 2 Part 2 Viber Prompt Log and Code Critique

Lanboer Zhao · ISBA 2438

## Prompts and results

### Prompt 1 Contact form and API

```text
Continue from my existing Part 1 Next.js portfolio. Start by inspecting the installed Next.js version, the App Router structure, `app/contact-me-server-form/actions.ts`, `lib/contact-validation.ts`, `lib/submissions-store.ts`, and the shared navigation. Tell me which existing code you can reuse and why.

For this round, add `/contact-me` with labeled Name, Email, and Message fields. Use a client form that sends JSON with `fetch` to `POST /api/contacts`. The assignment also names `POST /api/contact`, so expose both paths through the same POST handler. Add a navigation link to the new page and keep the original Server Action form available at `/contact-me-server-form`.


Reuse the Part 1 validation and storage so both forms append to the same `data/submissions.json` file and preserve existing records. Validate request bodies on the server. Reject malformed JSON, non-string fields, whitespace-only names or messages, and invalid email addresses. Apply the existing email rules to the submitted value. It must have exactly one `@`, a nonempty local part, a domain with at least one dot and no empty labels, and no whitespace anywhere.


Show success after the file is saved. Give clear field feedback for invalid input and a separate message for a request or storage failure. Keep contact data out of Git.


Using test data, verify a valid submission from each form and confirm that both records are in the same JSON file. Test both API paths and send invalid inputs directly to the API so browser validation cannot hide a server-side issue. Confirm rejected requests add no records. Report which files changed, what you verified, and the actual results. Stop after the contact increment so I can review it.
```

**Result**  Viber added the new Contact (API) page and routed both POST URLs through one handler. The two contact forms use the same validation and JSON storage.

### Prompt 2 Blog publishing and public pages

```text
Can you add a blog to the portfolio now? Take a look at how the project detail pages and navigation are set up so the blog fits the rest of the site. Check the docs for the version of Next.js in this repo if you need to.

I want to open `/admin/blogs`, type a title and the post itself, and hit Publish. The form should send JSON to `POST /api/blogs`. Check on the server that the title and body aren't blank, then save the post in its own blog data file. Give each post a unique slug so I can publish two posts with the same title without losing either one. On the form, show me whether the post was saved, a field needs fixing, or the request failed.


On `/blogs`, use `GET /api/blogs` to show all the posts, including anything I just published when I open or refresh the page. The assignment also mentions `/blog-posts`, so have that URL redirect to `/blogs`. Each post should open at `/blogs/[slug]` and show its title and body. If I type a slug that doesn't exist, show a clear 404. Add links so I can get to the blog list and the admin page easily during my demo.


Try publishing two different posts through the admin form, then refresh the list and click both to make sure they go to the right articles. Also try a missing slug and a blank title or body. Check that the blank submission doesn't get saved. Please run lint and a production build, and tell me which files you changed and what happened when you tested it.
```

**Result**  Viber added the admin form, GET and POST handlers, JSON storage, and the public blog list and detail pages. It also added the redirect from `/blog-posts` to `/blogs`.

### Prompt 3 Final checks

```text
Can you do one last check of my Part 2 portfolio? Your API tests passed for the contact form and the blog. I'd like to see whether both features work when I actually use the pages in a browser.

On `/contact-me`, try an invalid email like `person@example` and check that the error shows up next to the email field. Then try a valid submission and check the confirmation and form reset. Make sure the API form still saves to the same `data/submissions.json` file as the original Server Action form and keeps the earlier records.


On `/admin/blogs`, publish a test post through the form. Open `/blogs` and refresh to see if it shows up. Click two different post links and check that each one opens the right article. Try `/blogs/does-not-exist` too and make sure it gives a 404.


If you find a bug, fix it and repeat the steps that exposed it. Run lint and a production build at the end. If you can't run a browser check, tell me exactly what to click and what I should see.


For my prompt log, give me two or three examples from the code. For each one, tell me which file to look at, what you kept or changed and why, and what you actually saw when you tested it.
```

**Result**  Viber reported 31 passing checks against the production build, plus passing lint and build. It sent the same requests as the forms and inspected the code for browser feedback and reset behavior.

## Code critique

### Shared validation and storage

Viber proposed one handler in `lib/contact-request.ts` for both `/api/contacts` and `/api/contact`. I kept that setup and reused `lib/contact-validation.ts` and `lib/submissions-store.ts` from Part 1. This gives both contact forms the same validation rules and preserves earlier submissions in one place.

**Check and result**  Viber sent valid requests to both API paths. Each returned HTTP 201, and Viber confirmed that both records and a Server Action submission were present in the same JSON file along with earlier records.

### Email errors on the contact form

Viber returned field errors from `lib/contact-request.ts` and used them in `app/contact-me/contact-api-form.tsx`. I kept the error next to the email input because the visitor can see immediately which value to fix. The form also uses separate feedback for a request or save failure.

**Check and result**  Viber sent `person@example` directly to the API. It returned HTTP 400 with an error for the email field, and the record count stayed the same. Viber checked the component code to see where this error would appear.

### Unique URLs for posts with the same title

Viber added `uniqueSlug()` in `lib/blogs-store.ts`. I kept the numbered suffix so each article has its own URL even if I reuse a title. The detail page at `app/blogs/[slug]/page.tsx` looks up the article by that slug.

**Check and result**  Viber created two posts called “Hello World.” The API returned `hello-world` and `hello-world-2`, and each detail URL showed its own body text. Viber also checked that an unknown slug returned HTTP 404.
