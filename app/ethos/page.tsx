import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Ethos, Kanha Jodhpurkar",
  description: "How I run a room, and how my work maps to the field-marketing job.",
};

const PRINCIPLES = [
  "Vendors, partners, sponsors, and every attendee walk away genuinely happy. That's the whole job.",
  "Operator's rigor, carried over from a product-delivery background.",
  "Two-week timelines and last-minute changes are where I do my best work.",
  "Evenings, weekends, and the occasional flight for a conference are part of the deal.",
];

const MAPPING: { k: string; v: React.ReactNode }[] = [
  { k: "Executive dinners & VIP", v: <>Share Our Strength: dozens of vendors, high-net-worth donors and C-suite execs, with chef Sanjeev Kapoor and Grammy winner Shankar Mahadevan in the room.</> },
  { k: "Run-of-show & on-site", v: <>PitchTank SF: a 350+ person night sequenced start to finish, judges and pitches on time, there through the breakdown.</> },
  { k: "Sponsors & partners", v: <>Village Hacks @ ASU: 8+ sponsors and partners locked in about two weeks, 300+ builders in one room.</> },
  { k: "Community & registration", v: <>60+ Luma events across the SF developer scene, the registration platform and the rooms this role lives in.</> },
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

            <ul className="checklist" style={{ gridTemplateColumns: "1fr", marginTop: 24, maxWidth: "76ch" }}>
              {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
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
