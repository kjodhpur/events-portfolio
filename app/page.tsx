import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CountUp } from "@/components/CountUp";
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

const GROUND: { name: string; logo: string | null }[] = [
  { name: "ASU", logo: "/media/logos/asu.svg" },
  { name: "Startup Village", logo: "/media/logos/startup-village.svg" },
  { name: "Share Our Strength", logo: "/media/logos/share-our-strength.png" },
  { name: "Akshaya Patra", logo: "/media/logos/akshaya-patra.png" },
  { name: "HackWithIndia", logo: null },
  { name: "HackWithUSA", logo: null },
];

const PRINCIPLES = [
  "I do the unglamorous parts — setup, breakdown, and the 2am load-out.",
  "Vendors, partners, and donors walk away genuinely happy. That's the whole job.",
  "Run-of-show rigor, carried over from a product-delivery background.",
  "I'm here to grow in event & community marketing — not pass through it.",
];

const BACKGROUND: { k: string; v: React.ReactNode }[] = [
  { k: "Advisor", v: <>Strategic advisor to <b><a href="https://devnovate.co" target="_blank" rel="noopener noreferrer">Devnovate</a></b> (founder Aviral Bhardwaj) — 1M+ developers, 65+ hackathons, 25+ partners, 5,000+ projects.</> },
  { k: "Community", v: <>Plugged into <b>HackWithIndia</b> — India&apos;s largest hackathon community (100k+ students, 5k+ universities) — and <b>HackWithUSA</b>.</> },
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
    .eq("category", "produced")
    .order("sort", { ascending: false })
    .order("event_date", { ascending: false });

  const events = (data ?? []) as EventItem[];

  return (
    <>
      <SiteNav active="home" />

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
              for are below, with <a href="#work">receipts</a> — and I keep{" "}
              <a href="/field-notes">field notes</a> on the 50+ I&apos;ve attended.
            </p>

            <div className="bullets">
              <div className="bl-head">The operational backbone — the part I actually enjoy</div>
              <ul className="checklist">
                {BACKBONE.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>

            <div className="stats">
              <div className="stat"><div className="n"><CountUp end={350} suffix="+" /></div><div className="l">Attendees · PitchTank SF</div></div>
              <div className="stat"><div className="n"><CountUp end={64} /></div><div className="l">Luma events attended</div></div>
              <div className="stat"><div className="n"><CountUp end={300} suffix="+" /></div><div className="l">Builders · Village Hacks</div></div>
            </div>
          </div>
        </section>

        {/* proof grid */}
        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Built with · volunteered · advised</div>
            <p className="copy" style={{ marginBottom: 26 }}>
              Organizations I&apos;ve actually shown up for — <b>ASU</b> and <b>Startup Village</b>, anti-hunger
              nonprofits <b>Share Our Strength</b> and <b>Akshaya Patra</b>, and India&apos;s largest hackathon
              community.
            </p>
            <div className="proof">
              {GROUND.map((g) => (
                <div className="cell" key={g.name}>
                  {g.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="logo" src={g.logo} alt={g.name} />
                  ) : (
                    <span className="logo-text">{g.name}</span>
                  )}
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
            <ul className="checklist" style={{ gridTemplateColumns: "1fr", marginTop: 24, maxWidth: "76ch" }}>
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

      <SiteFooter />
    </>
  );
}
