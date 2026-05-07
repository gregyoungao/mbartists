# Supabase Setup — Step by Step

You're swapping WordPress + ACF for Supabase. End result: a public form at `/submit` that creates pending artist pages, and an admin page at `/admin/<secret>` to approve them.

---

## Phase 1: Supabase project setup

**Step 1 — Create the Supabase project**
- Go to https://supabase.com → New Project
- Pick a region close to your users (Frankfurt for EU)
- Save the database password somewhere safe
- Wait ~2 minutes for it to provision

**Step 2 — Run the schema**
- In your Supabase dashboard: **SQL Editor → New Query**
- Paste the entire contents of `supabase-schema.sql`
- Click **Run**
- Confirm tables exist: **Table Editor** should show `artists`, `agents`, `genres`, `locations`, `artist_genres`, `artist_locations`

**Step 3 — Create the storage bucket for images**
- **Storage → New Bucket**
- Name: `artist-images`
- Make it **Public** (so the frontend can display images directly)
- Click Create
- Then go to the bucket → **Policies** → **New Policy** → "For full customization"
- Add a policy: name "Anyone can upload artist images", allowed operation: INSERT, target roles: leave default, policy definition: `true`
- Save

**Step 4 — Seed your agents**
The form needs agents to exist before artists can be assigned to them. Either:
- **Table Editor → agents → Insert Row** (do this for each agent), or
- Run an INSERT in SQL Editor:
  ```sql
  insert into agents (slug, name, email) values
    ('alex-thompson', 'Alex Thompson', 'alex@mbartists.co.uk'),
    ('jane-doe', 'Jane Doe', 'jane@mbartists.co.uk');
  ```

**Step 5 — Grab your API credentials**
- **Project Settings → API**
- Copy **Project URL**, **anon public key**, and **service_role key**
- Keep the service_role key secret — never commit it

---

## Phase 2: Wire up Next.js

**Step 6 — Install the Supabase client**
```bash
npm install @supabase/supabase-js
```

**Step 7 — Add environment variables**
- Copy `.env.local.example` to `.env.local`
- Fill in the three Supabase values from Step 5
- Set `ADMIN_SECRET` to a long random string (generate one with `openssl rand -hex 32`)
- Restart `npm run dev`

**Step 8 — Drop in the new files**
Place these files into your existing project (overwriting where they exist):
- `lib/supabase.ts` → new
- `app/submit/page.tsx` → new
- `app/api/submit-artist/route.ts` → new
- `app/admin/[secret]/page.tsx` → new
- `app/artists/[slug]/page.tsx` → **replaces** the existing one (was client component using sample data, now server component using Supabase)

**Step 9 — Add image domain to next.config**
Open `next.config.mjs` and add your Supabase Storage hostname:
```js
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'your-project-ref.supabase.co' }
    ],
  },
}
```
Replace `your-project-ref` with the same one in your `NEXT_PUBLIC_SUPABASE_URL`.

**Step 10 — Update the artists list page (optional)**
Your current `app/artists/page.tsx` uses a hardcoded `ARTISTS` array. To pull from Supabase, you'll need to either:
- Convert it to a server component and call `getAllArtists()`, or
- Keep it as a client component and call `supabase.from('artists').select(...)` in a `useEffect`

The `lib/supabase.ts` file gives you `getAllArtists()` ready to go. The fields you'll need to swap: `artist.name` (same), `artist.genres` is now an array of `{name, slug}` objects (was strings), `artist.locations[0]?.name` instead of `artist.location`.

---

## Phase 3: Test the loop

**Step 11 — Submit a test artist**
- Go to `http://localhost:3000/submit`
- Fill in the form, upload an image, hit Submit
- You should see "Submission Received"

**Step 12 — Approve it**
- Go to `http://localhost:3000/admin/<your-ADMIN_SECRET>`
- You should see your pending submission
- Click Approve

**Step 13 — Verify the page exists**
- Go to `http://localhost:3000/artists/<slug-of-the-name-you-submitted>`
- The artist page should render with all the data you submitted

If it doesn't appear immediately, wait up to 60s (the `revalidate = 60` in the page config) or restart `npm run dev`.

---

## Phase 4: Production hardening (do before going live)

**Step 14 — Real authentication for /admin**
The current admin page just checks a secret in the URL. Before production:
- Add Supabase Auth or NextAuth
- Restrict admin access to specific user emails
- Or at minimum, put it behind HTTP basic auth via middleware

**Step 15 — Spam protection on /submit**
- Add Cloudflare Turnstile or hCaptcha to the form
- Add a honeypot field
- Rate-limit the API route (use `@upstash/ratelimit` or Vercel's built-in rate limiting)

**Step 16 — Image moderation**
- Anyone can upload images right now. Either:
  - Move uploads to a private bucket and only make them public after approval, or
  - Run uploaded images through a moderation API (Cloudflare Images, Sightengine) before approval

**Step 17 — Email notifications**
Trigger an email to admins when a new submission lands. Easiest path: add a Supabase database webhook that POSTs to a Resend/Postmark API on insert.

---

## Troubleshooting

**"Image upload failed"** → The `artist-images` bucket policy isn't allowing inserts. Re-check Step 3.

**"new row violates row-level security policy"** → The form is hitting the policy check. The API route uses the service role client which bypasses RLS, so this means your `SUPABASE_SERVICE_ROLE_KEY` env var isn't set. Restart the dev server after editing `.env.local`.

**Admin page 404s** → The URL secret doesn't match `ADMIN_SECRET` env var. Check for trailing whitespace.

**Artist page shows "not found" after approval** → ISR cached the 404. Either wait 60s, hit `/api/revalidate?path=/artists/[slug]` (you'd need to add that route), or restart dev.

**Genres/locations dropdown is empty in the form** → You haven't seeded any. The schema includes a small seed block at the bottom — re-run that section, or insert your own via Table Editor.
