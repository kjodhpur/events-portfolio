import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CIRCUIT } from "@/lib/circuit";

export const metadata = {
  title: "The Circuit, Kanha Jodhpurkar",
  description: "Every Luma event I showed up to across the SF circuit this summer.",
};

export default function Circuit() {
  return (
    <>
      <SiteNav active="circuit" />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="kicker">The Circuit, every room I got to</div>
            <h1>
              I showed up to <em>60+ events</em> in a single summer.
            </h1>
            <p className="lede">
              Every event I could get to this summer across the SF AI scene, hackathons, demo days, founder dinners,
              launch nights, watch parties. You only really learn this stuff by being in the room, so here&apos;s the
              full count.
            </p>
          </div>
        </section>

        <section className="section" id="circuit" style={{ paddingTop: 44 }}>
          <div className="wrap">
            <div className="sec-head">
              <h2>The full circuit</h2>
              <span className="count">/ {CIRCUIT.length} events, one summer</span>
            </div>
            <ol className="circuit">
              {CIRCUIT.map((e) => (
                <li className="circuit-item" key={e.url}>
                  <a href={e.url} target="_blank" rel="noopener noreferrer">{e.title}</a>
                  <span className="host">{e.host}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
