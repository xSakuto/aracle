"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { applyTeam, type JoinField, type JoinState } from "@/app/(site)/apply/actions";
import { APPLY_ROLES } from "@/data/apply";

const ORDER: JoinField[] = ["role", "name", "email", "about", "links"];

// Bewerbung fürs Team: Bereich wählen, kurz vorstellen, fertig.
export default function JoinForm({ defaultRole }: { defaultRole?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(applyTeam, { status: "idle" });
  const [started] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "unavailable" ? state.values : {};

  useEffect(() => {
    if (state.status === "invalid") {
      const first = ORDER.find((k) => errors[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    }
    if (state.status === "sent") doneRef.current?.focus();
    if (state.status === "unavailable") alertRef.current?.focus();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="tile p-8 outline-none md:p-10">
        <p className="kicker text-aqua">Bewerbung erhalten</p>
        <p className="head mt-4">Danke, {state.name}.</p>
        <p className="mt-4 max-w-[30rem] text-ink/80">Wir lesen jede Bewerbung selbst und melden uns per E-Mail oder Discord.</p>
        <Link href="/team" className="btn-quiet mt-8">Das Team ansehen</Link>
      </div>
    );
  }

  const err = (k: JoinField) =>
    errors[k] ? <p id={`j-${k}-error`} className="mt-2 text-[0.875rem] text-danger">{errors[k]}</p> : null;
  const aria = (k: JoinField) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `j-${k}-error` : undefined,
  });

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-7">
      <input type="hidden" name="t" value={started} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.status === "unavailable" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="rounded-[var(--radius)] border border-glow/40 bg-glow/10 p-5 outline-none">
          <p className="font-medium">Die Bewerbung konnte gerade nicht übermittelt werden.</p>
          <p className="mt-1 text-ink/80">Deine Angaben sind in einer E-Mail vorbereitet, die du mit einem Klick abschicken kannst.</p>
          <a href={state.mailto} className="btn mt-4">E-Mail öffnen</a>
        </div>
      )}

      <fieldset>
        <legend className="form-label">In welchem Bereich?</legend>
        <div className="mt-3 flex flex-wrap gap-2" aria-describedby={errors.role ? "j-role-error" : undefined}>
          {APPLY_ROLES.map((r, i) => (
            <label key={r.key} className="choice">
              <input type="radio" name="role" value={r.key} defaultChecked={(values.role ?? defaultRole) === r.key} data-field={i === 0 ? "role" : undefined} className="peer sr-only" />
              <span className="choice-pill">{r.label}</span>
            </label>
          ))}
        </div>
        {err("role")}
      </fieldset>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="j-name" className="form-label">Name</label>
          <input id="j-name" name="name" data-field="name" autoComplete="name" required defaultValue={values.name} className="form-input" placeholder="Vor- und Nachname" {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="j-email" className="form-label">E-Mail</label>
          <input id="j-email" name="email" type="email" data-field="email" autoComplete="email" spellCheck={false} required defaultValue={values.email} className="form-input" placeholder="name@mail.ch" {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="j-discord" className="form-label">Discord <span className="text-muted">(optional)</span></label>
        <input id="j-discord" name="discord" autoComplete="off" spellCheck={false} maxLength={40} defaultValue={values.discord} className="form-input" placeholder="deinname" />
      </div>

      <div>
        <label htmlFor="j-about" className="form-label">Über dich</label>
        <textarea id="j-about" name="about" data-field="about" required rows={5} maxLength={2000} defaultValue={values.about} className="form-input min-h-[9rem] resize-y" placeholder="Was kannst du, woran hast du schon gearbeitet, und worauf hättest du bei Aracle Lust?" {...aria("about")} />
        {err("about")}
      </div>

      <div>
        <label htmlFor="j-links" className="form-label">Portfolio oder Links <span className="text-muted">(optional)</span></label>
        <input id="j-links" name="links" data-field="links" autoComplete="url" spellCheck={false} maxLength={400} defaultValue={values.links} className="form-input" placeholder="GitHub, Behance, Website" {...aria("links")} />
        {err("links")}
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="small max-w-[24rem] text-muted">
          Wir nutzen deine Angaben nur für die Bewerbung. Mehr dazu im{" "}
          <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink">Datenschutz</Link>.
        </p>
        <button type="submit" disabled={pending} className="btn shrink-0">{pending ? "Wird gesendet…" : "Bewerbung senden"}</button>
      </div>
    </form>
  );
}
