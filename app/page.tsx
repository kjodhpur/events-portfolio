import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import type { EventItem } from "@/lib/types";

export const revalidate = 0; // always fresh

const BACKBONE = [
  "Run-of-shows & timelines",
  "Vendor & catering coordination",
  "Venue sourcing & rentals",
  "Budgets, invoices & contracts",
  "On-site setup & registration",
  "Breakdown & load-out",
];

const GROUND: { name: string; note: string }[] = [
  { name: "Frontier Tower", note: "PitchTank SF" },
  { name: "a16z", note: "SF circuit" },
  { name: "Cursor", note: "SF circuit" },
  { name: "Akshaya Patra", note: "Fundraiser" },
  { name: "Share Our Strength", note: "Anti-hunger" },
  { name: "Luma", note: "50+ events" },
];

const PRINCIPLES = [
  "I do the unglamorous parts — setup, breakdown, and the 2am load-out.",
  "Vendors, partners, and donors walk away genuinely happy. That's the whole job.",
  "Run-of-show rigor, carried over from a product-delivery background.",
  "I'm here to grow in event & community marketing — not pass through it.",
];

const BACKGROUND: { k: string; v: React.ReactNode }[] = [
  { k: "Product", v: <>AI Product Owner at <b>Deloitte</b> — Google&apos;s Rapid Innovation &ldquo;Genie&rdquo; project.</> },
  { k: "Public sector", v: <>IT PMO on a DoD contract · active <b>Secret clearance</b>.</> },
  { k: "Certified", v: <><b>CSPO</b> (Product Owner) &amp; <b>CSM</b> (ScrumMaster).</> },
  { k: "Built", v: <>Co-founded <b>HeartMetrics</b> — 1st place, ASU Love AI &amp; Business Challenge.</> },
  { k: "Content", v: <>Runs <b>CERTIFIED CRACKED</b> — interview &amp; meme reels; event promotion across social.</> },
];

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*, event_media(*), event_links(*)")
    .eq("published", true)
    .order("sort", { ascending: false })
    .order("event_date", { ascending: false });

  const events = (data ?? []) as EventItem[];

  return (
    <>
      {/* announcement bar */}
      <div className="announce">
        <div className="wrap">
          <span>
            <span className="dot">●</span>{" "}
            <span className="label-long">Currently in San Francisco — </span>
            open to field marketing &amp; event production roles
          </span>
          <a href="#contact">Get in touch →</a>
        </div>
      </div>

      {/* nav */}
      <header className="nav">
        <div className="wrap">
          <a className="brand" href="#top">
            <span className="mark" aria-hidden="true" />
            <b>Kanha Jodhpurkar</b> <span>/ Event Production</span>
          </a>
          <nav className="nav-links">
            <a className="hide-sm" href="#work">Work</a>
            <a className="hide-sm" href="#approach">Approach</a>
            <a className="hide-sm" href="#background">Background</a>
            <a href="#contact">Contact</a>
            <a className="nav-cta" href="mailto:kjodhpurkar@gmail.com">Get in touch</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* hero */}
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Field Marketing &amp; Event Production — San Francisco</div>
            <h1>
              I run events <em>end to end</em>, from the first vendor call to the final breakdown.
            </h1>
            <p className="lede">
              I&apos;m <b>Kanha Jodhpurkar</b>. I plan, host, and execute in-person experiences where the
              logistics are tight, the vendors and partners walk away genuinely happy, and the room actually
              feels something — then I stay for the breakdown. A few of the events I&apos;ve been on the ground
              for are below, with <a href="#work">receipts</a>.
            </p>

            <div className="bullets">
              <div className="bl-head">The operational backbone — the part I actually enjoy</div>
              <ul className="checklist">
                {BACKBONE.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>

            <div className="stats">
              <div className="stat"><div className="n">350+</div><div className="l">Largest event hosted</div></div>
              <div className="stat"><div className="n">50+</div><div className="l">SF events in a month</div></div>
              <div className="stat"><div className="n">Dozens</div><div className="l">Vendors &amp; partners run</div></div>
            </div>
          </div>
        </section>

        {/* proof grid */}
        <section className="section">
          <div className="wrap">
            <div className="eyebrow">On the ground at</div>
            <p className="copy" style={{ marginBottom: 26 }}>
              Venues, hosts, and partners I&apos;ve produced, worked, or volunteered with — not logos I&apos;m
              borrowing, but places I&apos;ve actually been on site.
            </p>
            <div className="proof">
              {GROUND.map((g) => (
                <div className="cell" key={g.name}>
                  {g.name}
                  <small>{g.note}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* selected events */}
        <section className="section" id="work">
          <div className="wrap">
            <div className="sec-head">
              <h2>Selected Events</h2>
              <span className="count">/ {events.length} on record</span>
            </div>

            {events.length === 0 ? (
              <p className="muted" style={{ padding: "40px 0", borderTop: "1px solid var(--line)" }}>
                No events yet. Head to <code>/admin</code> to add your first one.
              </p>
            ) : (
              events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i + 1} />)
            )}
          </div>
        </section>

        {/* approach */}
        <section className="section" id="approach">
          <div className="wrap">
            <div className="eyebrow">Approach</div>
            <blockquote className="quote">
              <p>
                &ldquo;I&apos;ve loved the whole arc of an event since I was a kid — the part where the vendors,
                the partners, and the room all walk away genuinely happy. I&apos;m not afraid of the 2am
                load-out.&rdquo;
              </p>
              <div className="cite">Kanha Jodhpurkar</div>
            </blockquote>
            <p className="copy" style={{ marginTop: 30 }}>
              In high school I opened and closed the local theater for the <b>2am Avengers: Infinity War</b>{" "}
              premiere — an early signal that I&apos;ll happily do the unglamorous, end-to-end work. That hasn&apos;t
              changed.
            </p>
            <ul className="checklist" style={{ gridTemplateColumns: "1fr", marginTop: 24, maxWidth: "64ch" }}>
              {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </section>

        {/* background */}
        <section className="section" id="background">
          <div className="wrap">
            <div className="eyebrow">Background — the operational rigor I bring to events</div>
            <ul className="facts">
              {BACKGROUND.map((f) => (
                <li key={f.k}>
                  <span className="k">{f.k}</span>
                  <span>{f.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* contact footer */}
      <footer id="contact">
        <div className="wrap">
          <div className="grid">
            <h4>Let&apos;s put<br />on something.</h4>
            <div className="contact">
              <div className="mono" style={{ color: "var(--muted)", fontSize: 11, letterSpacing: ".1em" }}>CONTACT</div>
              <a href="mailto:kjodhpurkar@gmail.com">kjodhpurkar@gmail.com</a><br />
              <a href="tel:+15715999810">571-599-9810</a><br />
              San Francisco, CA
            </div>
          </div>
          <div className="colophon">KANHA JODHPURKAR — EVENT PRODUCTION &amp; FIELD MARKETING — PORTFOLIO 2025</div>
        </div>
      </footer>
    </>
  );
}
