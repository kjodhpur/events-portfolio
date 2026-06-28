import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CountUp } from "@/components/CountUp";
import { OfficeTrashGame } from "@/components/OfficeTrashGame";
import type { EventItem } from "@/lib/types";

export const revalidate = 0; // always fresh

const BACKBONE = [
  "Run-of-show & planning docs",
  "Venue sourcing & vendor management",
  "Catering, rentals & entertainment",
  "Budgets, invoices & contracts",
  "Registration, RSVPs & guest lists",
  "On-site setup & attendee experience",
  "Swag, merch & event assets",
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
  { k: "Community", v: <>Embedded in the <b>developer community</b>, <b>MLH</b> (Major League Hacking), <b>HackWithUSA</b>, and <b>HackWithIndia</b> (100k+ students, 5k+ universities), plus the SF startup &amp; AI scene I show up to most weeks.</> },
  { k: "Advisor", v: <>Strategic advisor to <b><a href="https://devnovate.co" target="_blank" rel="noopener noreferrer">Devnovate</a></b> (founder <a href="https://www.linkedin.com/in/aviral-bhardwaj/" target="_blank" rel="noopener noreferrer">Aviral Bhardwaj</a>), 1M+ developers, 65+ hackathons, 25+ partners, 5,000+ projects.</> },
  { k: "Promotion", v: <>I document the events I run and show up to, <b>40k+ views</b> in a couple weeks, and run <b>CERTIFIED CRACKED</b> (interview &amp; meme reels). Promoting an event is just storytelling with a guest list.</> },
  { k: "Toolkit", v: <>I live in <b>Luma</b> for registration &amp; guest lists, run-of-show docs for the timeline, and spreadsheets for budgets, invoices &amp; vendor coordination.</> },
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
                I&apos;m <b>Kanha Jodhpurkar</b>. I run in-person events for <b>developers, founders, and
                engineering leaders</b>, executive dinners, hackathons, conferences, and meetups. I keep the
                run-of-show tight, source the venue and vendors, own registration and the guest list, send
                everyone home happy, and I&apos;m still the one there for the 2am breakdown. A few I&apos;ve run
                are <a href="#work">below</a>, plus <a href="/field-notes">field notes</a> on the 60+ I&apos;ve
                turned up to.
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

              <p className="hero-close">
                Exactly the in-person community a <b>developer-first database company</b> is built on.
              </p>
            </div>

            <aside className="hero-aside">
              <OfficeTrashGame />
              <div className="aside-note">Slow day at the office? Tidy up. (Yes, it&apos;s the lounge I run events in.)</div>
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

        {/* background */}
        <section className="section" id="background">
          <div className="wrap">
            <div className="eyebrow">Community, reach &amp; toolkit</div>
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
