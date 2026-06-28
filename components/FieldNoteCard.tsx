import type { EventItem, Media } from "@/lib/types";

function pad(n: number) { return String(n).padStart(3, "0"); }
function fmtYear(d: string | null) {
  if (!d) return null;
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

function MediaTile({ m, title }: { m: Media; title: string }) {
  if (m.kind === "video") {
    if (m.embed_url) {
      return <iframe src={m.embed_url} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
    }
    if (m.public_url) {
      return <video src={m.public_url} controls playsInline preload="metadata" />;
    }
    return null;
  }
  if (m.public_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={m.public_url} alt={title} />;
  }
  return null;
}

function Curl() {
  return (
    <svg className="curl" viewBox="0 0 28 24" aria-hidden="true">
      <path d="M24 22 C24 9 15 5 6 6 M6 6 l5 -3 M6 6 l3 5" />
    </svg>
  );
}

export function FieldNoteCard({ event, index }: { event: EventItem; index: number }) {
  const media = [...(event.event_media ?? [])].sort((a, b) => a.sort - b.sort);
  const links = [...(event.event_links ?? [])].sort((a, b) => a.sort - b.sort);
  const notes = [...(event.event_notes ?? [])].sort((a, b) => a.sort - b.sort);
  const highlights = notes.filter((n) => n.kind === "highlight");
  const improvements = notes.filter((n) => n.kind === "improvement");
  const year = fmtYear(event.event_date);

  return (
    <article className="event">
      <div className="meta">
        <div className="pass">FIELD NOTE {pad(index)}</div>
        {event.venue && <div className="row"><span>Where</span><span>{event.venue}</span></div>}
        {year && <div className="row"><span>When</span><span>{year}</span></div>}
        <span className="role">Attended</span>
      </div>

      <div className="ebody">
        <h3>{event.title}</h3>

        {media.length > 0 && (
          <div className="media-strip">
            {media.map((m) => <MediaTile key={m.id} m={m} title={event.title} />)}
          </div>
        )}

        {event.blurb && event.blurb.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}

        {(highlights.length > 0 || improvements.length > 0) && (
          <div className="notes">
            {highlights.length > 0 && (
              <div className="note-group good">
                <div className="note-head">What worked</div>
                <ul>{highlights.map((n) => <li key={n.id}><Curl /><span>{n.body}</span></li>)}</ul>
              </div>
            )}
            {improvements.length > 0 && (
              <div className="note-group tune">
                <div className="note-head">What I&apos;d tune</div>
                <ul>{improvements.map((n) => <li key={n.id}><Curl /><span>{n.body}</span></li>)}</ul>
              </div>
            )}
          </div>
        )}

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
