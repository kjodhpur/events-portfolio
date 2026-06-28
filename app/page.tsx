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

const GROUND: { name: string; logo: string | null; url: string }[] = [
  { name: "ASU", logo: "/media/logos/asu.svg", url: "https://www.asu.edu" },
  { name: "Startup Village", logo: "/media/logos/startup-village.svg", url: "https://www.startupvillage.club" },
  { name: "Share Our Strength", logo: "/media/logos/share-our-strength.png", url: "https://www.shareourstrength.org" },
  { name: "Akshaya Patra", logo: "/media/logos/akshaya-patra.png", url: "https://www.akshayapatra.org" },
  { name: "HackWithIndia", logo: null, url: "https://hackwithindia.com" },
  { name: "HackWithUSA", logo: null, url: "https://www.instagram.com/hackwith.usa/" },
  { name: "Devnovate", logo: "/media/logos/devnovate.ico", url: "https://devnovate.co" },
];

const BACKGROUND: { k: string; v: React.ReactNode }[] = [
  { k: "Advisor", v: <>Strategic advisor to <b><a href="https://devnovate.co" target="_blank" rel="noopener noreferrer">Devnovate</a></b> (founder <a href="https://www.linkedin.com/in/aviral-bhardwaj/" target="_blank" rel="noopener noreferrer">Aviral Bhardwaj</a>), 1M+ developers, 65+ hackathons, 25+ partners, 5,000+ projects.</> },
  { k: "Community", v: <>Plugged into <b>MLH</b> (Major League Hacking), <b>HackWithUSA</b>, and <b>HackWithIndia</b>, India&apos;s largest hackathon community (100k+ students, 5k+ universities).</> },
  { k: "Content", v: <>Started documenting the whole thing two weeks ago, already <b>40k+ views</b>. Also runs <b>CERTIFIED CRACKED</b> (interview &amp; meme reels).</> },
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
            <div className="kicker">Field Marketing &amp; Event Production, San Francisco</div>
            <h1>
              I run events <em>end to end</em>, from the first vendor call to the final breakdown.
            </h1>
            <p className="lede">
              I&apos;m <b>Kanha Jodhpurkar</b>, and I run events end to end. I keep the logistics tight, send the
              vendors and partners home happy, make the room actually feel like something, and I&apos;m still
              there for the breakdown. A few I&apos;ve run are below with <a href="#work">receipts</a>, plus{" "}
              <a href="/field-notes">field notes</a> on the 60+ I&apos;ve shown up to.
            </p>

            <div className="bullets">
              <div className="bl-head">The operational backbone, the part I actually enjoy</div>
              <ul className="checklist">
                {BACKBONE.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>

            <div className="stats">
              <div className="stat"><div className="n"><CountUp end={350} suffix="+" /></div><div className="l">Attendees · largest gathering</div></div>
              <div className="stat"><div className="n"><CountUp end={60} suffix="+" /></div><div className="l">Luma events attended</div></div>
            </div>
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

        {/* background */}
        <section className="section" id="background">
          <div className="wrap">
            <div className="eyebrow">Community, advisory &amp; content</div>
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
