# October Rose — Holiday Inn Jeddah Corniche

Standalone Next.js event registration system backed by **Neon PostgreSQL**. No Base44 or Supabase dependencies. The original published Base44 app and attendee data are untouched and not automatically imported.

## Routes
- `/` public guest form with logo placeholder/wordmark, Jeddah default and +966 phone.
- `/qr` shareable QR display targeting the deployed guest form.
- `/admin` organizer response dashboard, search and CSV export.

## Installation
1. Create a dedicated Neon database; run `schema.sql` against that database. PostgreSQL syntax is supported.
2. Configure `DATABASE_URL` (Neon pooled connection URL), `ADMIN_PIN` (strong secret), and `SESSION_SECRET` (at least 32 random bytes) as **server-only** Vercel environment variables.
3. Deploy from this GitHub repository to Vercel and perform a registration submission test. The app refuses to store registrations until `DATABASE_URL` is set.
4. Share `/` with guests and `/admin` only with organizers. Never place secrets in a Git commit.

## Important security notes
The shared PIN login is not protected against brute-force attempts with durable server-side rate limiting. **Do not use it to collect production personal data until rate limiting or proper administrator authentication is implemented.** A four-digit PIN (including 1017) is insufficient for an internet-facing contact-data dashboard. Data are stored only by the server; database credentials are never sent to the browser. The included wordmark is a vector approximation; replace with an approved hotel logo asset. Public registration should be covered by appropriate consent and retention terms.
