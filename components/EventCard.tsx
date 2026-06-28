import type { EventItem, Media } from "@/lib/types";
import { AutoVideo } from "./AutoVideo";

function pad(n: number) { return String(n).padStart(3, "0"); }
function fmtDate(d: string | null) {
  if (!d) return "";
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

function MediaTile({ m, title }: { m: Media; title: string }) {
  if (m.kind === "video") {
    if (m.embed_url) {
      return <iframe src={m.embed_url} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
    }
    if (m.public_url) return <AutoVideo src={m.public_url} />;
    return null;
  }
  if (m.public_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={m.public_url} alt={title} />;
  }
  return null;
}

export function EventCard({ event, index }: { event: EventItem; index: number }) {
  const media = [...(event.event_media ?? [])].sort((a, b) => a.sort - b.sort);
  const links = [...(event.event_links ?? [])].sort((a, b) => a.sort - b.sort);

  return (
    <article className="event">
      <div className="meta">
        <div className="pass">PASS NO. {pad(index)}</div>
        {event.scope && <div className="scope">{event.scope}</div>}
        {event.venue && <div className="row"><span>Venue</span><span>{event.venue}</span></div>}
        {event.scale && <div className="row"><span>Scale</span><span>{event.scale}</span></div>}
        <div className="row"><span>Year</span><span>{fmtDate(event.event_date)}</span></div>
        {event.role && <span className="role">{event.role}</span>}
      </div>

      <div className="ebody">
        <h3>{event.title}</h3>

        {media.length > 0 && (
          <div className="media-strip">
            {media.map((m) => <MediaTile key={m.id} m={m} title={event.title} />)}
          </div>
        )}

        {event.blurb && event.blurb.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}

        {links.length > 0 && (
          <div className="links">
            {links.map((l) => (
              <div key={l.id}>→ <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
