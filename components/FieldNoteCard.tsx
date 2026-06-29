import type { EventItem } from "@/lib/types";
import { TeardownBody } from "./TeardownBody";

function pad(n: number) { return String(n).padStart(3, "0"); }
function fmtYear(d: string | null) {
  if (!d) return null;
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

export function FieldNoteCard({ event, index }: { event: EventItem; index: number }) {
  const year = fmtYear(event.event_date);
  const links = [...(event.event_links ?? [])].sort((a, b) => a.sort - b.sort);
  return (
    <article className="event">
      <div className="meta">
        <div className="pass">FIELD NOTE {pad(index)}</div>
        {event.venue && <div className="row"><span>Where</span><span>{event.venue}</span></div>}
        {year && <div className="row"><span>When</span><span>{year}</span></div>}
        {links.length > 0 && (
          <div className="links">
            {links.map((l) => (
              <div key={l.id}>→ <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></div>
            ))}
          </div>
        )}
      </div>
      <TeardownBody event={event} />
    </article>
  );
}
