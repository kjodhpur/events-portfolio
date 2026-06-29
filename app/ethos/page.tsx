import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Ethos, Kanha Jodhpurkar",
  description: "How I run a room, why PlanetScale, and how my work maps to the field-marketing job.",
};

const MAPPING: { k: string; v: React.ReactNode }[] = [
  { k: "Executive dinners & VIP", v: <>Share Our Strength: dozens of vendors, high-net-worth donors and C-suite execs, with chef Sanjeev Kapoor and Grammy winner Shankar Mahadevan in the room.</> },
  { k: "Run-of-show & on-site", v: <>PitchTank SF: a 350+ person night sequenced start to finish, judges and pitches on time, there through the breakdown.</> },
  { k: "Sponsors & partners", v: <>Village Hacks @ ASU: 8+ sponsors and partners locked in about two weeks, 300+ builders in one room.</> },
  { k: "Community & registration", v: <>60+ Luma events across the SF developer scene, the registration platform and the rooms this role lives in.</> },
];

const BACKGROUND: { k: string; v: React.ReactNode }[] = [
  { k: "Community", v: <>Embedded in the <b>developer community</b>, <b>MLH</b> (Major League Hacking), <b>HackWithUSA</b>, and <b>HackWithIndia</b> (100k+ students, 5k+ universities), plus the SF startup &amp; AI scene I show up to most weeks.</> },
  { k: "Advisor", v: <>Strategic advisor to <b><a href="https://devnovate.co" target="_blank" rel="noopener noreferrer">Devnovate</a></b> (founder <a href="https://www.linkedin.com/in/aviral-bhardwaj/" target="_blank" rel="noopener noreferrer">Aviral Bhardwaj</a>), 1M+ developers, 65+ hackathons, 25+ partners, 5,000+ projects.</> },
  { k: "Promotion", v: <>I document the events I run and show up to, <b>40k+ views</b> in two weeks and climbing. I also run <b>CERTIFIED CRACKED</b> (interview &amp; meme reels). Promoting an event is just storytelling with a guest list.</> },
  { k: "Toolkit", v: <>I live in <b>Luma</b> for registration &amp; guest lists, run-of-show docs for the timeline, and spreadsheets for budgets, invoices &amp; vendor coordination.</> },
];

export default function Ethos() {
  return (
    <>
      <SiteNav active="ethos" />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Ethos, how I run a room</div>
            <h1>
              I love the parts of an event <em>most people avoid</em>.
            </h1>

            <p className="copy" style={{ marginTop: 26 }}>
              In high school I opened and closed the local theater for the <b>2am Avengers: Infinity War</b>{" "}
              premiere. An early sign I&apos;ll happily do the unglamorous, end-to-end work, and that hasn&apos;t
              changed since.
            </p>
          </div>
        </section>

        <section className="section" id="run-room">
          <div className="wrap">
            <div className="eyebrow">How I&apos;d run the room</div>
            <p className="copy" style={{ marginBottom: 4 }}>
              A single <b>run-of-show</b> routes the whole night, fanning out across every workstream, from venue
              and vendors to registration and breakdown, so the room lands as one clean experience for every
              attendee.
            </p>
            <div className="rd-tree">
              <ul>
                <li>
                  <div className="rd-box rd-gate">Run-of-Show</div>
                  <ul>
                    <li>
                      <div className="rd-box rd-primary">Event Execution</div>
                      <ul>
                        <li><div className="rd-box rd-replica">Venue &amp; vendors</div></li>
                        <li><div className="rd-box rd-replica">Catering</div></li>
                      </ul>
                    </li>
                    <li>
                      <div className="rd-box rd-primary">Attendee Experience</div>
                      <ul>
                        <li><div className="rd-box rd-replica">Registration</div></li>
                        <li><div className="rd-box rd-replica">RSVPs &amp; follow-up</div></li>
                      </ul>
                    </li>
                    <li>
                      <div className="rd-box rd-primary">Logistics &amp; Swag</div>
                      <ul>
                        <li><div className="rd-box rd-replica">Swag &amp; merch</div></li>
                        <li><div className="rd-box rd-replica">Load-out</div></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="rd-cap">
              Cross-functional by design: sponsors, speakers, vendors, and the on-site team all routing through one plan.
            </div>
          </div>
        </section>

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

        <section className="section" id="mapping">
          <div className="wrap">
            <div className="eyebrow">My work, mapped to the role</div>
            <ul className="facts">
              {MAPPING.map((m) => (
                <li key={m.k}>
                  <span className="k">{m.k}</span>
                  <span>{m.v}</span>
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
