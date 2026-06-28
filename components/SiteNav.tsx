export function SiteNav({ active }: { active?: "home" | "field-notes" }) {
  return (
    <>
      <div className="announce">
        <div className="wrap">
          <span>
            <span className="dot">●</span>{" "}
            <span className="label-long">Currently in San Francisco — </span>
            open to field marketing &amp; event production roles
          </span>
          <a href="mailto:kjodhpurkar@gmail.com">Get in touch →</a>
        </div>
      </div>

      <header className="nav">
        <div className="wrap">
          <a className="brand" href="/">
            <span className="mark" aria-hidden="true" />
            <b>Kanha Jodhpurkar</b> <span>/ Event Production</span>
          </a>
          <nav className="nav-links">
            <a className="hide-sm" href="/#work">Work</a>
            <a className={active === "field-notes" ? "active" : undefined} href="/field-notes">Field Notes</a>
            <a className="hide-sm" href="/#approach">Approach</a>
            <a className="hide-sm" href="/#background">Background</a>
            <a href="#contact">Contact</a>
            <a className="nav-cta" href="mailto:kjodhpurkar@gmail.com">Get in touch</a>
          </nav>
        </div>
      </header>
    </>
  );
}
