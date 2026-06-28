import type { EventItem, Media } from "@/lib/types";

function pad(n: number) { return String(n).padStart(3, "0"); }
function fmtYear(d: string | null) {
  if (!d) return null;
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

function VideoBlock({ m }: { m: Media }) {
  if (m.embed_url) {
    return (
      <div className="frame media">
        <iframe src={m.embed_url} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  if (m.public_url) {
    return (
      <div className="frame media">
        <video src={m.public_url} controls playsInline preload="metadata" />
      </div>
    );
  }
  return null;
}

export function FieldNoteCard({ event, index }: { event: EventItem; index: number }) {
  const media = [...(event.event_media ?? [])].sort((a, b) => a.sort - b.sort);
  const photos = media.filter((m) => m.kind === "photo" && m.public_url);
  const videos = media.filter((m) => m.kind === "video");
  const links = [...(event.event_links ?? [])].sort((a, b) => a.sort - b.sort);
  const notes = [...(event.event_notes ?? [])].sort((a, b) => a.sort - b.sort);
  const highlights = notes.filter((n) => n.kind === "highlight");
  const improvements = notes.filter((n) => n.kind === "improvement");

  const hero = photos[0];
  const rest = photos.slice(1);
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

        {videos.length > 0 && (
          <div className={videos.length > 1 ? "vgrid" : undefined}>
            {videos.map((v) => <VideoBlock key={v.id} m={v} />)}
          </div>
        )}

        {hero && (
          <div className="frame media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.public_url!} alt={event.title} />
          </div>
        )}

        {event.blurb && event.blurb.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}

        {rest.length > 0 && (
          <div className="gallery">
            {rest.map((p) => (
              <div className="frame" key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.public_url!} alt="" />
              </div>
            ))}
          </div>
        )}

        {(highlights.length > 0 || improvements.length > 0) && (
          <div className="notes">
            {highlights.length > 0 && (
              <div className="note-group good">
                <div className="note-head">What worked</div>
                <ul>{highlights.map((n) => <li key={n.id}>{n.body}</li>)}</ul>
              </div>
            )}
            {improvements.length > 0 && (
              <div className="note-group tune">
                <div className="note-head">What I&apos;d tune</div>
                <ul>{improvements.map((n) => <li key={n.id}>{n.body}</li>)}</ul>
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
