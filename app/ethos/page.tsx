import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Ethos, Kanha Jodhpurkar",
  description: "How I think about events, and why I love the parts most people avoid.",
};

const PRINCIPLES = [
  "I do the unglamorous parts, setup, breakdown, and the 2am load-out.",
  "Vendors, partners, and donors walk away genuinely happy. That's the whole job.",
  "Run-of-show rigor, carried over from a product-delivery background.",
  "I'm here to grow in event & community marketing, not pass through it.",
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

            <blockquote className="quote" style={{ marginTop: 26 }}>
              <p>
                &ldquo;I&apos;ve loved the whole arc of an event since I was a kid, the part where the vendors,
                the partners, and the room all walk away genuinely happy. I&apos;m not afraid of the 2am
                load-out.&rdquo;
              </p>
              <div className="cite">Kanha Jodhpurkar</div>
            </blockquote>

            <p className="copy" style={{ marginTop: 30 }}>
              In high school I opened and closed the local theater for the <b>2am Avengers: Infinity War</b>{" "}
              premiere, an early signal that I&apos;ll happily do the unglamorous, end-to-end work. That hasn&apos;t
              changed.
            </p>

            <ul className="checklist" style={{ gridTemplateColumns: "1fr", marginTop: 24, maxWidth: "76ch" }}>
              {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
