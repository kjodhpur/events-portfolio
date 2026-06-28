import type { EventItem, Media } from "@/lib/types";

function pad(n: number) { return String(n).padStart(3, "0"); }
function fmtDate(d: string | null) {
  if (!d) return "—";
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

function VideoBlock({ m }: { m: Media }) {
  if (m.embed_url) {
    return (
      <div className="frame">
        <iframe src={m.embed_url} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  if (m.public_url) {
    return (
      <div className="frame">
        <video src={m.public_url} controls playsInline preload="metadata" />
      </div>
    );
  }
  return null;
}

export function EventCard({ event, index }: { event: EventItem; index: number }) {
  const media = [...(event.event_media ?? [])].sort((a, b) => a.sort - b.sort);
  const photos = media.filter((m) => m.kind === "photo" && m.public_url);
  const videos = media.filter((m) => m.kind === "video");
  const links = [...(event.event_links ?? [])].sort((a, b) => a.sort - b.sort);

  const hero = photos[0];
  const rest = photos.slice(1);

  return (
    <article className="event">
      <div className="meta">
        <div className="pass">PASS NO. {pad(index)}</div>
        {event.venue && <div className="row"><span>Venue</span><span>{event.venue}</span></div>}
        {event.scale && <div className="row"><span>Scale</span><span>{event.scale}</span></div>}
        <div className="row"><span>Year</span><span>{fmtDate(event.event_date)}</span></div>
        {event.role && <span className="role">{event.role}</span>}
      </div>

      <div className="ebody">
        <h3>{event.title}</h3>

        {videos.map((v) => <VideoBlock key={v.id} m={v} />)}

        {hero && (
          <div className="frame">
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
