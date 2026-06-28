import { createClient } from "@/lib/supabase/server";
import { FieldNoteCard } from "@/components/FieldNoteCard";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { EventItem } from "@/lib/types";

export const revalidate = 0;

export const metadata = {
  title: "Field Notes, Kanha Jodhpurkar",
  description: "Events I've attended across the SF circuit, read through a field-marketing lens.",
};

export default async function FieldNotes() {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*, event_media(*), event_links(*), event_notes(*)")
    .eq("published", true)
    .eq("category", "attended")
    .order("sort", { ascending: false })
    .order("event_date", { ascending: false });

  const notes = (data ?? []) as EventItem[];

  return (
    <>
      <SiteNav active="field-notes" />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Field Notes, the attendee&apos;s side of the room</div>
            <h1>
              I study events <em>as a field marketer</em>, not just attend them.
            </h1>
            <p className="lede">
              Across 60+ Luma events this summer, at a16z, Cursor, NVIDIA, Vercel, and beyond, I watched how the
              best <b>developer-first</b> companies run a room: registration flow, swag, catering, signage, seat
              spacing, the small operational details most people miss. This is the exact <b>developer and founder
              community</b> I want to keep building events for. Below are a few teardowns, what worked and what
              I&apos;d tune. The full run is over on <a href="/circuit">The Circuit</a>.
            </p>
          </div>
        </section>

        <section className="section" id="notes" style={{ paddingTop: 44 }}>
          <div className="wrap">
            <div className="sec-head">
              <h2>Teardowns</h2>
              <span className="count">/ {notes.length} on record</span>
            </div>

            {notes.length === 0 ? (
              <p className="muted" style={{ padding: "40px 0", borderTop: "1px solid var(--line)" }}>
                No field notes yet.
              </p>
            ) : (
              notes.map((ev, i) => <FieldNoteCard key={ev.id} event={ev} index={i + 1} />)
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
