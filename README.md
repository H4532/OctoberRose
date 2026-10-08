# October Rose — Holiday Inn Jeddah Corniche

Standalone registration app replacing Base44 dependency. **No Base44 registrations are automatically imported**. Existing Base44 site is not changed.

## Pages
- `/`: public registration form, pink October Rose branding, hotel wordmark, Jeddah default, +966 telephone, in-person RSVP.
- `/admin`: PIN-protected registration dashboard with search, expected guest count and CSV export.

## Setup
1. Create a **new dedicated Supabase project** and run `schema.sql` in its SQL editor.
2. Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PIN`, and random `SESSION_SECRET` in Vercel Environment Variables for production (never prefix these with NEXT_PUBLIC_). Keep secrets out of GitHub.
3. Deploy this repository as a Next.js project using Vercel. Verify test registration is saved, public visitors cannot load `/api/admin/registrations`, and organizer login works.
4. Share only `/` with guests, and give `/admin` to organizers. Avoid distributing the PIN in the invitation.

### Security notes
- No public Supabase table permissions; reads and writes are server-side.
- The four-digit PIN 1017 previously requested is weak: use a longer admin secret and additional platform-level restrictions for real attendee contact details.
- This simple standalone implementation currently lacks durable server-side rate limiting for PIN attempts; before public launch, use Vercel WAF/rate limiting, or upgrade to authenticated administrator accounts.
- The included wordmark is a vector approximation; replace with an approved hotel logo file if available.
- Registration is only functional after database and environment configuration; no form submissions should be considered saved until verified.
