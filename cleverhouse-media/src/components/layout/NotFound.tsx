import Link from "../ui/Link";
import { LogoMark } from "../brand/Logo";
import { Button } from "../ui/Button";

export function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-ink">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 w-[60vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        aria-hidden="true"
      >
        <LogoMark />
      </div>
      <div className="shell relative text-center">
        <p className="label text-copper-300">Error 404</p>
        <h1 className="mx-auto mt-6 max-w-[14ch] font-display text-giant font-medium">
          This idea hasn’t been <span className="serif-accent text-copper-300">built yet.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[42ch] text-lead text-bone/65">
          The page you’re looking for moved or never existed. Let’s get you somewhere useful.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to Home</Button>
          <Button href="/work" variant="ghost" icon={false}>
            See our work
          </Button>
        </div>
        <p className="mt-10 text-sm text-bone/45">
          Or{" "}
          <Link href="/contact" className="link-line text-bone/70">
            tell us what you were looking for
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
