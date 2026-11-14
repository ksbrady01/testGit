import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Loader2, AlertCircle } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { validateInquiry, type FieldErrors, type InquiryPayload, type InquiryType } from "../../lib/inquiry";
import { budgetOptions, serviceInterestOptions, site, timelineOptions } from "../../content/site";
import clsx from "../../lib/clsx";

type Field = "company" | "website" | "phone" | "service" | "budget" | "timeline" | "message" | "keywords" | "location" | "goals";

export function InquiryForm({
  type,
  fields,
  goals,
  goalsLabel = "What would you like us to look at?",
  messageLabel = "Tell us about your project",
  messagePlaceholder = "What are you building, what’s not working, and what does success look like?",
  submitLabel = "Send it over",
  successTitle = "Thank you — we’ve got it.",
  successBody = "A real person on our team will review your note and reply within one to two business days.",
  light = false,
  defaultService,
}: {
  type: InquiryType;
  fields: Field[];
  goals?: string[];
  goalsLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  light?: boolean;
  defaultService?: string;
}) {
  const [values, setValues] = useState<Partial<InquiryPayload>>({ type, service: defaultService, goals: [] });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const has = (f: Field) => fields.includes(f);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.focus();
      gsap.from(successRef.current.querySelectorAll("[data-s]"), { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "expo.out" });
      gsap.fromTo(successRef.current.querySelector("[data-check]"), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2)" });
    }
  }, [status]);

  const set = (k: keyof InquiryPayload, v: string | string[]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleGoal = (g: string) => {
    const cur = values.goals || [];
    set("goals", cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hp = (new FormData(e.currentTarget).get("company_url") as string) || "";
    const payload = { ...values, type, hp, startedAt: startedAt.current };
    const errs = validateInquiry(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error || "Please check the highlighted fields and try again.");
        setStatus("error");
      }
    } catch {
      setServerError("We couldn’t reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const fieldCls = clsx("field", light && "field-light");
  const labelCls = clsx("label mb-1 block", light ? "text-ink/55" : "text-bone/55");
  const errCls = "mt-2 flex items-center gap-1.5 text-sm text-[#f08a6c]";
  const chipCls = clsx("chip", light && "chip-light text-ink");

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className={clsx("rounded-[28px] p-8 outline-hidden md:p-12", light ? "bg-white ring-1 ring-ink/10" : "bg-ink-850 ring-1 ring-bone/10")} role="status" aria-live="polite">
        <span data-check className="grid h-16 w-16 place-items-center rounded-full bg-copper-400 text-ink">
          <Check size={30} strokeWidth={2.5} />
        </span>
        <h3 data-s className="mt-8 font-display text-big font-medium">
          {successTitle}
        </h3>
        <p data-s className={clsx("mt-4 max-w-[48ch] text-lg", light ? "text-ink/65" : "text-bone/70")}>
          {successBody}
        </p>
        <p data-s className={clsx("mt-8 text-sm", light ? "text-ink/50" : "text-bone/50")}>
          Need us sooner? Email <a className="link-line text-copper-500" href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
    );
  }

  const err = (k: keyof InquiryPayload) =>
    errors[k] ? (
      <p id={`${k}-error`} className={errCls}>
        <AlertCircle size={14} aria-hidden="true" /> {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof InquiryPayload) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-9" aria-busy={status === "sending"}>
      {/* Honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-9 md:grid-cols-2">
        <div>
          <label htmlFor={`${type}-name`} className={labelCls}>
            Your name *
          </label>
          <input id={`${type}-name`} name="name" autoComplete="name" className={fieldCls} placeholder="Jordan Rivera" value={values.name || ""} onChange={(e) => set("name", e.target.value)} {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${type}-email`} className={labelCls}>
            Email *
          </label>
          <input id={`${type}-email`} name="email" type="email" autoComplete="email" className={fieldCls} placeholder="you@company.com" value={values.email || ""} onChange={(e) => set("email", e.target.value)} {...a11y("email")} />
          {err("email")}
        </div>
        {has("company") && (
          <div>
            <label htmlFor={`${type}-company`} className={labelCls}>
              Company / organization
            </label>
            <input id={`${type}-company`} name="company" autoComplete="organization" className={fieldCls} placeholder="Company name" value={values.company || ""} onChange={(e) => set("company", e.target.value)} />
          </div>
        )}
        {has("website") && (
          <div>
            <label htmlFor={`${type}-website`} className={labelCls}>
              Website {type.includes("evaluation") ? "*" : ""}
            </label>
            <input id={`${type}-website`} name="website" inputMode="url" autoComplete="url" className={fieldCls} placeholder="yourcompany.com" value={values.website || ""} onChange={(e) => set("website", e.target.value)} {...a11y("website")} />
            {err("website")}
          </div>
        )}
        {has("phone") && (
          <div>
            <label htmlFor={`${type}-phone`} className={labelCls}>
              Phone (optional)
            </label>
            <input id={`${type}-phone`} name="phone" type="tel" autoComplete="tel" className={fieldCls} placeholder="(555) 000-0000" value={values.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </div>
        )}
        {has("location") && (
          <div>
            <label htmlFor={`${type}-location`} className={labelCls}>
              Primary service area
            </label>
            <input id={`${type}-location`} name="location" className={fieldCls} placeholder="City or region you serve" value={values.location || ""} onChange={(e) => set("location", e.target.value)} />
          </div>
        )}
      </div>

      {has("keywords") && (
        <div>
          <label htmlFor={`${type}-keywords`} className={labelCls}>
            What should people find you for?
          </label>
          <input id={`${type}-keywords`} name="keywords" className={fieldCls} placeholder="e.g. emergency plumber austin, family law firm dallas" value={values.keywords || ""} onChange={(e) => set("keywords", e.target.value)} />
        </div>
      )}

      {has("service") && (
        <fieldset>
          <legend className={labelCls}>I&apos;m interested in *</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {serviceInterestOptions.map((o) => (
              <label key={o} className="relative">
                <input type="radio" name="service" value={o} checked={values.service === o} onChange={() => set("service", o)} className="peer sr-only" />
                <span className={chipCls}>{o}</span>
              </label>
            ))}
          </div>
          {err("service")}
        </fieldset>
      )}

      {has("goals") && goals && (
        <fieldset>
          <legend className={labelCls}>{goalsLabel}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {goals.map((g) => (
              <label key={g} className="relative">
                <input type="checkbox" name="goals" value={g} checked={(values.goals || []).includes(g)} onChange={() => toggleGoal(g)} className="sr-only" />
                <span className={chipCls}>{g}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {(has("budget") || has("timeline")) && (
        <div className="grid gap-9 md:grid-cols-2">
          {has("budget") && (
            <fieldset>
              <legend className={labelCls}>Budget range</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {budgetOptions.map((o) => (
                  <label key={o} className="relative">
                    <input type="radio" name="budget" value={o} checked={values.budget === o} onChange={() => set("budget", o)} className="sr-only" />
                    <span className={chipCls}>{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {has("timeline") && (
            <fieldset>
              <legend className={labelCls}>Desired timeline</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {timelineOptions.map((o) => (
                  <label key={o} className="relative">
                    <input type="radio" name="timeline" value={o} checked={values.timeline === o} onChange={() => set("timeline", o)} className="sr-only" />
                    <span className={chipCls}>{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      {has("message") && (
        <div>
          <label htmlFor={`${type}-message`} className={labelCls}>
            {messageLabel} {type === "contact" || type === "careers" ? "*" : ""}
          </label>
          <textarea
            id={`${type}-message`}
            name="message"
            rows={5}
            className={clsx(fieldCls, "resize-y")}
            placeholder={messagePlaceholder}
            value={values.message || ""}
            onChange={(e) => set("message", e.target.value)}
            {...a11y("message")}
          />
          {err("message")}
        </div>
      )}

      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={clsx("max-w-[42ch] text-sm", light ? "text-ink/55" : "text-bone/50")}>
          We&apos;ll only use your details to respond to this request. See our{" "}
          <a href="/privacy" className="link-line underline-offset-2">
            privacy policy
          </a>
          .
        </p>
        <button type="submit" disabled={status === "sending"} className={clsx("btn shrink-0", light ? "btn-dark" : "btn-copper", status === "sending" && "opacity-80")}>
          <span className="relative">{status === "sending" ? "Sending…" : submitLabel}</span>
          <span className="btn-icon" aria-hidden="true">
            {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
          </span>
        </button>
      </div>

      <div aria-live="assertive" className="min-h-px">
        {status === "error" && serverError && (
          <p className="flex items-start gap-2 rounded-2xl bg-[#f08a6c]/10 p-4 text-sm text-[#f3a58c] ring-1 ring-[#f08a6c]/30">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {serverError} You can also email{" "}
              <a className="underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
