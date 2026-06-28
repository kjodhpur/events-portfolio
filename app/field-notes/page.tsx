import { createClient } from "@/lib/supabase/server";
import { FieldNoteCard } from "@/components/FieldNoteCard";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CIRCUIT } from "@/lib/circuit";
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
              Across 60+ Luma events this summer, at a16z, Cursor, NVIDIA, Vercel, and beyond, I watch how the
              best teams run the room: registration flow, swag, catering, signage, seat spacing, the small operational details
              most people miss. Below are a few teardowns, what worked, and what I&apos;d tune, and the full circuit.
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

        <section className="section" id="circuit">
          <div className="wrap">
            <div className="eyebrow">The full circuit, 60+ events, one summer</div>
            <p className="copy" style={{ marginBottom: 22 }}>
              Every event I showed up to this summer across the SF AI scene, hackathons, demo days, founder dinners, launch
              nights, watch parties. You only really learn this stuff by being in the room, so here&apos;s the count.
            </p>
            <ol className="circuit">
              {CIRCUIT.map((e) => (
                <li className="circuit-item" key={e.url}>
                  <a href={e.url} target="_blank" rel="noopener noreferrer">{e.title}</a>
                  <span className="host">{e.host}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
