"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sendInquiry, type InquiryField, type InquiryState } from "@/app/(site)/kontakt/actions";
import { BUDGETS, PROJECT_TYPES } from "@/data/inquiry";

const ORDER: InquiryField[] = ["type", "name", "email", "company", "description", "budget"];

export default function InquiryForm({ defaultType }: { defaultType?: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(sendInquiry, { status: "idle" });
  const [started] = useState(() => Date.now());
  const [len, setLen] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "unavailable" ? state.values : {};

  // Fokus auf den ersten Fehler bzw. auf die Bestätigung
  useEffect(() => {
    if (state.status === "invalid") {
      const first = ORDER.find((k) => errors[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    }
    if (state.status === "sent") doneRef.current?.focus();
    if (state.status === "unavailable") alertRef.current?.focus();
    // Zeichenzähler nach dem Zurückfüllen aktualisieren
    if (state.status === "invalid" || state.status === "unavailable") setLen(state.values.description?.length ?? 0);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="tile p-8 outline-none md:p-10">
        <p className="kicker text-aqua">Anfrage erhalten</p>
        <p className="head mt-4">Danke, {state.name}.</p>
        <p className="mt-4 max-w-[30rem] text-ink/80">
          Deine Anfrage ist bei uns eingegangen. Wir lesen jede Anfrage
          persönlich und melden uns per E-Mail bei dir.
        </p>
        <Link href="/projekte" className="btn-quiet mt-8">Projekte ansehen</Link>
      </div>
    );
  }

  const err = (k: InquiryField) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-[0.875rem] text-danger">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: InquiryField) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-7">
      <input type="hidden" name="t" value={started} />
      {/* Falle für Bots: für Menschen unsichtbar */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "unavailable" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="rounded-[var(--radius)] outline-none border border-glow/40 bg-glow/10 p-5">
          <p className="font-medium">{state.reason}</p>
          <p className="mt-1 text-ink/80">
            Deine Angaben sind nicht verloren: Wir haben sie in eine E-Mail
            übernommen, die du mit einem Klick abschicken kannst.
          </p>
          <a href={state.mailto} className="btn mt-4">E-Mail mit deinen Angaben öffnen</a>
        </div>
      )}

      <fieldset>
        <legend className="form-label">Worum geht es?</legend>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-describedby={errors.type ? "type-error" : undefined}>
          {PROJECT_TYPES.map((t, i) => (
            <label key={t.key} className="choice">
              <input
                type="radio"
                name="type"
                value={t.key}
                defaultChecked={(values.type ?? defaultType) === t.key}
                data-field={i === 0 ? "type" : undefined}
                className="peer sr-only"
              />
              <span className="choice-pill">{t.label}</span>
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="f-name" className="form-label">Name</label>
          <input id="f-name" name="name" data-field="name" autoComplete="name" required defaultValue={values.name} className="form-input" placeholder="Vor- und Nachname" {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="f-email" className="form-label">E-Mail</label>
          <input id="f-email" name="email" type="email" data-field="email" autoComplete="email" spellCheck={false} required defaultValue={values.email} className="form-input" placeholder="name@firma.ch" {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="f-company" className="form-label">
          Unternehmen <span className="text-muted">(optional)</span>
        </label>
        <input id="f-company" name="company" data-field="company" autoComplete="organization" defaultValue={values.company} className="form-input" placeholder="Firma oder Organisation" />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="f-desc" className="form-label">Projektbeschreibung</label>
          <span className="small nums text-muted" aria-hidden>{len} / 4000</span>
        </div>
        <textarea
          id="f-desc"
          name="description"
          data-field="description"
          required
          rows={6}
          maxLength={4000}
          defaultValue={values.description}
          onChange={(e) => setLen(e.target.value.length)}
          className="form-input min-h-[10rem] resize-y"
          placeholder="Was soll entstehen, für wen, und bis wann?"
          {...aria("description")}
        />
        {err("description")}
      </div>

      <div>
        <label htmlFor="f-budget" className="form-label">
          Budgetrahmen <span className="text-muted">(optional)</span>
        </label>
        <select id="f-budget" name="budget" data-field="budget" defaultValue={values.budget ?? ""} className="form-input form-select">
          <option value="">Keine Angabe</option>
          {BUDGETS.map((b) => (
            <option key={b.key} value={b.key}>{b.label}</option>
          ))}
        </select>
        {err("budget")}
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="small max-w-[24rem] text-muted">
          Wir verwenden deine Angaben nur, um deine Anfrage zu beantworten. Mehr
          dazu im <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink">Datenschutz</Link>.
        </p>
        <button type="submit" disabled={pending} className="btn shrink-0">
          {pending ? "Wird gesendet…" : "Anfrage senden"}
        </button>
      </div>
    </form>
  );
}
