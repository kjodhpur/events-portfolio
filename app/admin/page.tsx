"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { EventItem } from "@/lib/types";

const supabase = createClient();

// Accepts a YouTube/Vimeo link (any format) or a direct video file URL.
// Returns the field to store: embed_url for platforms, public_url for direct files.
function normalizeVideoUrl(input: string): { embed_url?: string; public_url?: string } | null {
  const raw = input.trim();
  if (!raw) return null;
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    if (id) return { embed_url: `https://www.youtube.com/embed/${id}` };
  }
  if (host.endsWith("youtube.com")) {
    let id: string | null | undefined = u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    if (!id && (parts[0] === "shorts" || parts[0] === "embed")) id = parts[1];
    if (id) return { embed_url: `https://www.youtube.com/embed/${id}` };
  }
  if (host === "vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) return { embed_url: `https://player.vimeo.com/video/${id}` };
  }
  if (host === "player.vimeo.com") return { embed_url: raw };
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(u.pathname)) return { public_url: raw };
  if (u.pathname.includes("/embed/")) return { embed_url: raw };
  return { public_url: raw };
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("events")
      .select("*, event_media(*), event_links(*)")
      .order("sort", { ascending: false })
      .order("event_date", { ascending: false });
    setEvents((data ?? []) as EventItem[]);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      if (data.session) load();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
      if (session) load();
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
  }

  if (authed === null) return <div className="admin"><p className="muted">Loading…</p></div>;

  if (!authed) {
    return (
      <div className="admin">
        <h1>Admin</h1>
        <form onSubmit={signIn} style={{ maxWidth: 360 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <label>Password</label>
          <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" required />
          {err && <p style={{ color: "var(--signal)", marginTop: 10, fontSize: 14 }}>{err}</p>}
          <div style={{ marginTop: 18 }}><button className="btn" type="submit">Sign in</button></div>
          <p className="muted" style={{ marginTop: 16 }}>
            Create your login once in Supabase → Authentication → Users → Add user.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage Events</h1>
        <button className="btn ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      <p className="muted" style={{ marginBottom: 20 }}>
        <a href="/" style={{ color: "var(--emerald)" }}>← View live site</a>
      </p>

      <NewEvent onSaved={load} />

      <h2 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", margin: "30px 0 10px" }}>
        Existing ({events.length})
      </h2>
      {events.map((ev) => <EventRow key={ev.id} ev={ev} onChange={load} />)}
    </div>
  );
}

/* ---------------- New event form ---------------- */
function NewEvent({ onSaved }: { onSaved: () => void }) {
  const [f, setF] = useState({ title: "", event_date: "", venue: "", role: "", scale: "", blurb: "" });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  async function save() {
    if (!f.title) return;
    setSaving(true);
    const sortMax = Date.now() % 100000; // simple incrementing-ish sort
    await supabase.from("events").insert({
      title: f.title,
      event_date: f.event_date || null,
      venue: f.venue || null,
      role: f.role || null,
      scale: f.scale || null,
      blurb: f.blurb || null,
      sort: sortMax,
      published: true,
    });
    setF({ title: "", event_date: "", venue: "", role: "", scale: "", blurb: "" });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="card">
      <strong>+ New event</strong>
      <label>Title</label>
      <input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="PitchTank SF" />
      <div className="row2">
        <div><label>Date</label><input type="date" value={f.event_date} onChange={(e) => set("event_date", e.target.value)} /></div>
        <div><label>Venue</label><input value={f.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Frontier Tower, SF" /></div>
      </div>
      <div className="row2">
        <div><label>Your role</label><input value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="Host & Producer" /></div>
        <div><label>Scale</label><input value={f.scale} onChange={(e) => set("scale", e.target.value)} placeholder="350+ attendees" /></div>
      </div>
      <label>Blurb (one paragraph per line)</label>
      <textarea value={f.blurb} onChange={(e) => set("blurb", e.target.value)} placeholder="What you did, in your words." />
      <div style={{ marginTop: 14 }}>
        <button className="btn alt" onClick={save} disabled={saving || !f.title}>{saving ? "Saving…" : "Create event"}</button>
      </div>
    </div>
  );
}

/* ---------------- Existing event row (media, links, delete) ---------------- */
function EventRow({ ev, onChange }: { ev: EventItem; onChange: () => void }) {
  const [busy, setBusy] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [link, setLink] = useState({ label: "", url: "" });

  async function uploadFiles(files: FileList | null, kind: "photo" | "video") {
    if (!files || files.length === 0) return;
    setBusy(`Uploading ${kind}…`);
    for (const file of Array.from(files)) {
      const path = `events/${ev.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) { setBusy("Error: " + error.message); return; }
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("event_media").insert({ event_id: ev.id, kind, storage_path: path, public_url: pub.publicUrl, sort: Date.now() % 100000 });
    }
    setBusy("");
    onChange();
  }

  async function addVideoUrl() {
    const parsed = normalizeVideoUrl(videoUrl);
    if (!parsed) { setBusy("Couldn't read that URL"); return; }
    setBusy("Adding video…");
    await supabase.from("event_media").insert({
      event_id: ev.id,
      kind: "video",
      embed_url: parsed.embed_url ?? null,
      public_url: parsed.public_url ?? null,
      sort: Date.now() % 100000,
    });
    setVideoUrl(""); setBusy(""); onChange();
  }

  async function addLink() {
    if (!link.label || !link.url) return;
    await supabase.from("event_links").insert({ event_id: ev.id, label: link.label, url: link.url, sort: Date.now() % 100000 });
    setLink({ label: "", url: "" }); onChange();
  }

  async function delMedia(id: string, storage_path: string | null) {
    if (storage_path) await supabase.storage.from("media").remove([storage_path]);
    await supabase.from("event_media").delete().eq("id", id);
    onChange();
  }
  async function delLink(id: string) { await supabase.from("event_links").delete().eq("id", id); onChange(); }
  async function togglePub() { await supabase.from("events").update({ published: !ev.published }).eq("id", ev.id); onChange(); }
  async function delEvent() {
    if (!confirm(`Delete "${ev.title}" and all its media?`)) return;
    for (const m of ev.event_media ?? []) if (m.storage_path) await supabase.storage.from("media").remove([m.storage_path]);
    await supabase.from("events").delete().eq("id", ev.id);
    onChange();
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong>{ev.title}</strong>
        <span className="tag">{ev.published ? "live" : "draft"}</span>
      </div>
      <p className="muted">{ev.venue} · {ev.role} · {ev.scale}</p>

      <div style={{ margin: "12px 0", display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
        <span className="muted">Photos: {(ev.event_media ?? []).filter(m => m.kind === "photo").length}</span>
        <span className="muted">Videos: {(ev.event_media ?? []).filter(m => m.kind === "video").length}</span>
        <span className="muted">Links: {(ev.event_links ?? []).length}</span>
      </div>

      {(ev.event_media ?? []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {(ev.event_media ?? []).map((m) => (
            <span key={m.id} className="tag" style={{ cursor: "pointer" }} onClick={() => delMedia(m.id, m.storage_path)} title="click to remove">
              {m.kind}{m.embed_url ? " (embed)" : ""} ✕
            </span>
          ))}
        </div>
      )}
      {(ev.event_links ?? []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {(ev.event_links ?? []).map((l) => (
            <span key={l.id} className="tag" style={{ cursor: "pointer" }} onClick={() => delLink(l.id)} title="click to remove">{l.label} ✕</span>
          ))}
        </div>
      )}

      <label>Add photos</label>
      <input type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files, "photo")} />

      <label>Add video file (keep clips short, see README on size limits)</label>
      <input type="file" accept="video/*" onChange={(e) => uploadFiles(e.target.files, "video")} />

      <label>…or paste a video link, YouTube, Vimeo, or a direct .mp4 URL (best for large videos)</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtu.be/…  or  https://…/clip.mp4" />
        <button className="btn ghost" onClick={addVideoUrl}>Add</button>
      </div>
      <p className="muted" style={{ marginTop: 6 }}>
        Direct file uploads above go to Supabase (~50MB/file cap). For larger videos, upload to YouTube/Vimeo (unlisted works) or any host and paste the link here, no size limit.
      </p>

      <label>Add article / link</label>
      <div className="row2">
        <input value={link.label} onChange={(e) => setLink((s) => ({ ...s, label: e.target.value }))} placeholder="Times of India coverage" />
        <input value={link.url} onChange={(e) => setLink((s) => ({ ...s, url: e.target.value }))} placeholder="https://…" />
      </div>
      <div style={{ marginTop: 8 }}><button className="btn ghost" onClick={addLink}>Add link</button></div>

      {busy && <p className="muted" style={{ marginTop: 10 }}>{busy}</p>}

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button className="btn ghost" onClick={togglePub}>{ev.published ? "Unpublish" : "Publish"}</button>
        <button className="btn" style={{ background: "var(--signal)" }} onClick={delEvent}>Delete event</button>
      </div>
    </div>
  );
}
