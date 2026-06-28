# events-portfolio

Next.js 14 (App Router) portfolio for Kanha Jodhpurkar — field marketing & coordination.

## Working agreements
- **Push changes directly to `main`** without asking for confirmation and without opening a PR, unless explicitly told otherwise.

## Where things live
- **Event content is in Supabase, not the repo.** The "Top 3 hosting examples" (homepage) and "Teardowns" / "full circuit" (Field Notes) are read at runtime from the `events`, `event_media`, `event_links`, and `event_notes` tables. Edit copy for a specific event via the Supabase MCP or the `/admin` page — not in code.
  - Supabase project ref: `lypijijmiunrceyimzgh`
  - `category` splits events: `produced` (homepage) vs `attended` (Field Notes).
- The static Luma "full circuit" list is the one exception — it's hard-coded in `lib/circuit.ts`.
- Shared copy/markup lives in `components/` (`SiteNav`, `SiteFooter`, `EventCard`, `FieldNoteCard`, `TeardownBody`, `AutoVideo`); all styling is in `app/globals.css`.

## Notes
- No local `.env.local`; the app needs `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` to build or run.
