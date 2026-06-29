import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CountUp } from "@/components/CountUp";
import type { EventItem } from "@/lib/types";

export const revalidate = 0; // always fresh

const BACKBONE = [
  "Walking Target for decor that'll actually look right",
  "Stretching the same budget without it feeling cheap",
  "Taping down cables so nobody trips mid-talk",
  "Stacking the last chairs after everyone leaves",
];

const GROUND: { name: string; logo: string | null; url: string }[] = [
  { name: "ASU", logo: "/media/logos/asu.svg", url: "https://www.asu.edu" },
  { name: "Startup Village", logo: "/media/logos/startup-village.svg", url: "https://www.startupvillage.club" },
  { name: "Share Our Strength", logo: "/media/logos/share-our-strength.png", url: "https://www.shareourstrength.org" },
  { name: "Akshaya Patra", logo: "/media/logos/akshaya-patra.png", url: "https://www.akshayapatra.org" },
  { name: "HackWithIndia", logo: null, url: "https://hackwithindia.com" },
  { name: "HackWithUSA", logo: null, url: "https://www.instagram.com/hackwith.usa/" },
  { name: "Devnovate", logo: "/media/logos/devnovate.ico", url: "https://devnovate.co" },
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
          <div className="wrap hero-grid">
            <div className="hero-main">
              <div className="kicker">Field Marketing &amp; Event Coordination · San Francisco</div>
              <h1>
                I run <em>in-person events</em> end to end, from the first vendor call to the final breakdown.
              </h1>
              <p className="lede">
                I&apos;m <b>Kanha Jodhpurkar</b>. PlanetScale serves the exact community I already build for,{" "}
                <b>developers, founders, and engineering leaders</b>, and runs the kind of small, high-trust team I
                want to grow inside of. The family feel, the environment that pushes everyone to do their best
                work, and the values it&apos;s built on are why I&apos;d want to stay and get genuinely great at
                this in one place, not pass through it. A few I&apos;ve run are <a href="#work">below</a>, plus{" "}
                <a href="/field-notes">field notes</a> on the 60+ I&apos;ve turned up to.
              </p>

              <div className="bullets">
                <div className="bl-head">The behind-the-scenes work I love</div>
                <ul className="checklist">
                  {BACKBONE.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>

              <div className="stats">
                <div className="stat"><div className="n"><CountUp end={350} suffix="+" /></div><div className="l">Attendees · largest gathering</div></div>
                <div className="stat"><div className="n"><CountUp end={60} suffix="+" /></div><div className="l">Luma events attended</div></div>
              </div>

              <p className="hero-close">
                I&apos;ll own every piece with real pride, build the workflows that make the next one run tighter,
                and keep learning the parts I haven&apos;t touched yet.
              </p>
            </div>

            <aside className="hero-aside">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-img" src="/media/kanha-endorsement.jpg" alt="A person holding a legal pad that reads: Kanha is the man for the job, here's why" />
              <div className="endorse">[endorsed by ye]</div>
            </aside>
          </div>
        </section>

        {/* proof grid */}
        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Built with · volunteered · advised</div>
            <p className="copy" style={{ marginBottom: 26 }}>
              Organizations I&apos;ve actually shown up for, <b>ASU</b> and <b>Startup Village</b>, anti-hunger
              nonprofits <b>Share Our Strength</b> and <b>Akshaya Patra</b>, and India&apos;s largest hackathon
              community.
            </p>
            <div className="proof">
              {GROUND.map((g) => (
                <a className="cell" key={g.name} href={g.url} target="_blank" rel="noopener noreferrer">
                  {g.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="logo" src={g.logo} alt={g.name} />
                  ) : (
                    <span className="logo-text">{g.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* top 3 hosting examples */}
        <section className="section" id="work">
          <div className="wrap">
            <div className="sec-head">
              <h2>Top 3 Unique Hosting Examples</h2>
              <span className="count">/ regional · international · university</span>
            </div>

            {events.length === 0 ? (
              <p className="muted" style={{ padding: "40px 0", borderTop: "1px solid var(--line)" }}>
                No events yet.
              </p>
            ) : (
              events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i + 1} />)
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
