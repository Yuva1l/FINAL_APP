# QA Report

## What was tested

- Home page (`/`) loads.
- Admin area requiring auth: `/admin`, `/admin/login`.
- Events page for valid slug: `/events/<valid-slug>` loads.
- Unknown event slug: `/events/does-not-exist` shows 404 page.
- Invalid paths such as `/aaaa`, `/admin/xyz`, `/api/unknown/route` return 404/405.
- Negative API tests using `curl`:
  - POST `/api/auth/login` with bad payload (invalid email/password).
  - POST `/api/admin/events` with duplicate slug.
  - POST `/api/admin/tickets` with invalid `eventId`.
  - POST `/api/checkout` with invalid `ticketTypeId` or quantity.

## Status codes & results

| Test | Expected status | Actual/Expected result |
|---|---|---|
| Invalid login payload | 400 | Returns JSON with Zod `fieldErrors` for `email` and `password` |
| Invalid credentials | 401 | Returns `{ "error": "Invalid credentials" }` |
| Duplicate event slug | 409 | Returns `{ "error": "Slug already in use. Choose a different slug." }` |
| Create ticket for unknown event | 404 | Returns `{ "error": "Not found" }` |
| Checkout unknown ticket | 404 | Returns `{ "error": "Ticket not found" }` |
| Checkout quantity > available or zero | 400 | Returns `{ "error": "Sold out" }` |
| Unknown API route | 405/404 | Returns JSON error message with appropriate status |
| Unknown page | 404 | Not‑found page rendered |

## Screenshots

- **404 page**: When navigating to a non‑existent event (`/events/does-not-exist`), the app shows a clean not‑found page with the message “Page not found (404)”【799224302714226†screenshot】.
- **Duplicate slug error**: Attempting to create an event with a slug that already exists returns a 409 response with an error message indicating that the slug is already in use【962267477943259†screenshot】.
- **Validation failure**: Sending a malformed login payload returns a 400 response with Zod `fieldErrors` describing which fields are invalid【697339555229146†screenshot】.

The above tests confirm that the application gracefully handles missing pages, duplicate slugs, invalid input and unknown API routes without crashing.