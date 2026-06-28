"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type { EventItem, Media } from "@/lib/types";
import { AutoVideo } from "./AutoVideo";

function MediaInner({ m, title }: { m: Media; title: string }) {
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

export function TeardownBody({ event }: { event: EventItem }) {
  const media = [...(event.event_media ?? [])].sort((a, b) => a.sort - b.sort);
  const links = [...(event.event_links ?? [])].sort((a, b) => a.sort - b.sort);
  const notes = [...(event.event_notes ?? [])].sort((a, b) => a.sort - b.sort);
  const highlights = notes.filter((n) => n.kind === "highlight");
  const improvements = notes.filter((n) => n.kind === "improvement");

  const bodyRef = useRef<HTMLDivElement>(null);
  const tiles = useRef<Array<HTMLElement | null>>([]);
  const anchors = useRef<Map<string, HTMLElement | null>>(new Map());
  const [arrows, setArrows] = useState<Array<{ d: string; cls: string }>>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const cont = bodyRef.current;
      if (!cont) return;
      const cb = cont.getBoundingClientRect();
      const out: Array<{ d: string; cls: string }> = [];
      for (const n of notes) {
        if (!n.media_ref) continue;
        const tile = tiles.current[n.media_ref - 1];
        const anc = anchors.current.get(n.id);
        if (!tile || !anc) continue;
        const t = tile.getBoundingClientRect();
        const a = anc.getBoundingClientRect();
        const sx = a.left - cb.left;
        const sy = a.top - cb.top + a.height / 2;
        const ex = t.left - cb.left + t.width / 2;
        const ey = t.top - cb.top + t.height - 5;
        if (ey >= sy - 6) continue; // tile must sit above the note
        let d: string;
        if (n.kind === "highlight") {
          d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`;
        } else {
          const cx = Math.max(ex, sx) + 34;
          const cy = (sy + ey) / 2;
          d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
        }
        out.push({ d, cls: n.kind === "highlight" ? "good" : "tune" });
      }
      setArrows(out);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (bodyRef.current) ro.observe(bodyRef.current);
    tiles.current.forEach((t) => t && ro.observe(t));
    window.addEventListener("resize", measure);
    const els = Array.from(bodyRef.current?.querySelectorAll("img, video") ?? []);
    els.forEach((el) => { el.addEventListener("load", measure); el.addEventListener("loadedmetadata", measure); });
    const t1 = window.setTimeout(measure, 600);
    const t2 = window.setTimeout(measure, 1600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      els.forEach((el) => { el.removeEventListener("load", measure); el.removeEventListener("loadedmetadata", measure); });
      window.clearTimeout(t1); window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ebody" ref={bodyRef}>
      <h3>{event.title}</h3>

      {media.length > 0 && (
        <div className="media-strip">
          {media.map((m, i) => (
            <div className="m-wrap" key={m.id} ref={(el) => { tiles.current[i] = el; }}>
              <MediaInner m={m} title={event.title} />
            </div>
          ))}
        </div>
      )}

      {event.blurb && event.blurb.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}

      {(highlights.length > 0 || improvements.length > 0) && (
        <div className="notes">
          {highlights.length > 0 && (
            <div className="note-group good">
              <div className="note-head">What worked</div>
              <ul>{highlights.map((n) => (
                <li key={n.id}>
                  <span className="mk">+</span>
                  <span className="txt">{n.body}<span className="anchor" ref={(el) => { anchors.current.set(n.id, el); }} /></span>
                </li>
              ))}</ul>
            </div>
          )}
          {improvements.length > 0 && (
            <div className="note-group tune">
              <div className="note-head">What I&apos;d tune</div>
              <ul>{improvements.map((n) => (
                <li key={n.id}>
                  <span className="mk">&#9651;</span>
                  <span className="txt">{n.body}<span className="anchor" ref={(el) => { anchors.current.set(n.id, el); }} /></span>
                </li>
              ))}</ul>
            </div>
          )}
        </div>
      )}

      {arrows.length > 0 && (
        <svg className="arrow-layer" aria-hidden="true">
          <defs>
            <marker id="ah-good" markerWidth="9" markerHeight="9" refX="5.5" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6" fill="none" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="ah-tune" markerWidth="9" markerHeight="9" refX="5.5" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6" fill="none" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {arrows.map((a, i) => (
            <path key={i} className={a.cls} d={a.d} markerEnd={a.cls === "good" ? "url(#ah-good)" : "url(#ah-tune)"} />
          ))}
        </svg>
      )}

      {links.length > 0 && (
        <div className="links">
          {links.map((l) => (
            <div key={l.id}>→ <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></div>
          ))}
        </div>
      )}
    </div>
  );
}
