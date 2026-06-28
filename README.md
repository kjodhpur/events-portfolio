# Kanha — Events Portfolio (upload app)

A real, deployable portfolio: a public scrolling page of stacked events, plus a private
`/admin` panel where you log in and add events, upload photos and short videos, paste
YouTube/Vimeo links for longer video, and attach article links. Built with **Next.js +
Supabase** (Postgres, Storage, Auth), made to host on **Vercel**.

---

## Hand this to Claude Code

Open this folder in Claude Code on desktop and say: *"Set up and deploy this app."* The steps
below are what it (or you) will do. Nothing here needs to be edited by hand except `.env.local`.

---

## 1. Create the Supabase project
1. Go to supabase.com, create a new project (free tier is fine to start).
2. In the SQL Editor, paste the entire contents of `supabase/schema.sql` and run it.
   This creates the `events`, `event_media`, `event_links` tables, the `media` storage
   bucket, and all the row-level-security policies.

## 2. Create your admin login
- Supabase dashboard → **Authentication → Users → Add user** → set your email + a password.
- That email/password is what you'll use at `/admin`. (No public sign-up exists; only you.)

## 3. Wire up env vars
1. Copy `.env.local.example` to `.env.local`.
2. Fill in from Supabase → **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Run it locally
```bash
npm install
npm run dev
```
- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin  → sign in → add your events.

## 5. Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel → New Project → import the repo.
3. Add the same two env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   in Vercel → Project → Settings → Environment Variables.
4. Deploy. Your live URL is ready; `/admin` works the same way in production.

---

## Important: video file sizes (read this)
Hosting raw video in Supabase Storage is the heavy path. Free tier is ~1GB total and the
upload API caps individual files (≈50MB by default). So:
- **Short clips (a few seconds, compressed):** fine to upload directly in `/admin`.
- **Anything longer / heavier:** upload it to **YouTube or Vimeo as unlisted**, copy the
  *embed* URL (e.g. `https://www.youtube.com/embed/VIDEO_ID`), and paste it into the
  "embed URL" field. It looks identical on the page with none of the storage cost.

If you later want true large-file self-hosting, swap Storage for a video host like
Mux or Cloudflare Stream — Claude Code can wire that in as a v2.

---

## How content maps to the page
- **Event fields:** title, date (year shown), venue, your role (green tag), scale
  (e.g. "350+ attendees"), and a blurb (one paragraph per line).
- **Media:** first photo becomes the hero; extra photos fill a 3-up gallery; videos
  (file or embed) render above the hero.
- **Links:** show as a "→ label" list under the blurb (great for the Times of India
  article and your LinkedIn committee post).
- Each event is auto-numbered as `PASS NO. 001`, `002`, … in the call-sheet style.

## Editing the hero / stats
The headline, intro line, and the three top stats are in `app/page.tsx` (the `<header>`
block). Change the copy or numbers there.

## Notes
- The public page only shows events marked **published**. Toggle draft/live per event in `/admin`.
- Deleting an event also deletes its uploaded files from Storage.
- Design tokens (colors, fonts) live at the top of `app/globals.css`.
