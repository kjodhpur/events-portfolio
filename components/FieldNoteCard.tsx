import type { EventItem } from "@/lib/types";
import { TeardownBody } from "./TeardownBody";

function pad(n: number) { return String(n).padStart(3, "0"); }
function fmtYear(d: string | null) {
  if (!d) return null;
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

export function FieldNoteCard({ event, index }: { event: EventItem; index: number }) {
  const year = fmtYear(event.event_date);
  return (
    <article className="event">
      <div className="meta">
        <div className="pass">FIELD NOTE {pad(index)}</div>
        {event.venue && <div className="row"><span>Where</span><span>{event.venue}</span></div>}
        {year && <div className="row"><span>When</span><span>{year}</span></div>}
        <span className="role">Attended</span>
      </div>
      <TeardownBody event={event} />
    </article>
  );
}
