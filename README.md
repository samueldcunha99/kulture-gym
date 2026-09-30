# Kulture Fitness Club

A professional ten-page website with actual gym photographs, a saved trial-request workflow, and an owner panel.

## Run and validate

Run `npm run build`, then `npm run dev`. Open http://127.0.0.1:4173. The local preview uses SQLite in the ignored `.sites-runtime` folder. Local owner sign-in is simulated only by `server.mjs` on loopback and is not included in the deployed Worker.

Run `npm run check` to verify pages, links, assets and anchors. Run `node test-worker.mjs` to verify saved enquiries, idempotency, validation, origin checks, owner/staff authorisation, follow-ups and persistent content edits against a temporary SQLite database.

## Source

- `build.mjs` and `extras.mjs`: shared layouts and page content.
- `default-content.mjs`: mock plans, trainers, services, timings and policies.
- `public/assets/styles.css` and `premium.css`: responsive design and transitions.
- `public/assets/app.js`, `live.js`, `premium.js`: interactions and owner controls.
- `worker.mjs`: production API, authorisation, spam checks and database access.
- `db/schema.ts` and `drizzle/`: schema and generated, versioned migrations.
- `dist/client` and `dist/server`: generated deployment output.

## Confirm before public launch

The user requested mock business details. Prices, validity, joining fees, taxes, opening hours, classes, trainer names, qualifications and service descriptions are labelled preview content. Replace and approve them through Owner panel > Club content before launch. Actual gym photos and supplied branding are integrated. The two final uploaded photos were byte-identical, so the gallery uses five unique views.

The address, phone and Google rating come from the supplied listing. The user confirmed +91 99215 87777 as the WhatsApp number. No member testimonials or transformation photos have been invented. Add approved member content when available.

This release does not accept payments, activate memberships, offer member login, or integrate attendance systems. Those were optional in the supplied checklist.

## Owner access

The initial review Site is owner-private. `PRIVATE_OWNER_BOOTSTRAP=enabled` allows its first platform-authenticated visitor to be recorded as the immutable owner. The owner should open `/admin/` while the Site remains private. Disable the bootstrap environment variable before changing sharing to public. Do not publish publicly before the owner identity is established.

Production trusts only Sites dispatch identity headers. Owner content edits and staff grants are checked server-side; staff can view and follow up enquiries but cannot change website content or grant access. Staff must also have the platform-level permission needed to view a private Site. Application grants alone do not change Site sharing.

## Trial workflow

Requests save to D1 with a reference, preferred visit date/time, status and assigned front desk handler. The owner panel displays new requests and refreshes while open. Staff can record follow-up notes, contact visitors, mark confirmed trials and export CSV. WhatsApp and call links require a visitor/staff click; there is no automatic WhatsApp notification or unattended external messaging service.

The front desk confirms visits after checking availability. No booking is automatically confirmed. Forms have server validation, a one-use arithmetic check, honeypot, per-network limits, same-origin checks and idempotent request IDs. Errors preserve form input. Contact click counts are aggregate.

## Privacy and backups

The policy page explains data use and contact-based deletion requests. Close enquiries after handling; old closed rows are cleaned during subsequent trial submissions. Export enquiries and club content regularly from the owner panel. Production D1 and local preview data are separate. Local test data and database files are never committed or uploaded.

## Hosting

`.openai/hosting.json` retains the Site ID and logical D1 binding. Sites owns the database and applies saved migrations. Worker output is ESM with a default `fetch` handler and serves public files through the assets binding.
