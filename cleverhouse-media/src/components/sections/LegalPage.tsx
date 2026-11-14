import { SplitHeading } from "../motion/Motion";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <section className="relative bg-ink pb-14 pt-36 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
        <div className="shell relative">
          <p className="label label-dot text-copper-300">Legal</p>
          <SplitHeading as="h1" onLoad delay={0.45} className="mt-6 font-display text-giant font-medium">
            {title}
          </SplitHeading>
          <p className="mt-6 text-bone/55">Last updated {updated}</p>
        </div>
      </section>
      <section className="surface-paper py-20 md:py-28">
        <div className="shell grid gap-12 md:grid-cols-12">
          <nav aria-label="On this page" className="md:col-span-3">
            <ol className="space-y-2 text-sm text-ink/60 md:sticky md:top-28">
              {sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#s${i}`} className="link-line hover:text-ink">
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-12 md:col-span-8 md:col-start-5">
            {sections.map((s, i) => (
              <section key={s.h} id={`s${i}`} className="scroll-mt-28">
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink">{s.h}</h2>
                {s.p.map((p, j) => (
                  <p key={j} className="mt-4 text-lg leading-relaxed text-ink/75">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
