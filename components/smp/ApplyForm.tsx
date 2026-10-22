"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { applySmp, type ApplyField, type ApplyState } from "@/app/(site)/smp/actions";

const ORDER: ApplyField[] = ["ign", "discord", "email", "why"];

// Bewerbung für AracleSMP: vier Felder, mehr nicht.
export default function ApplyForm() {
  const [state, action, pending] = useActionState<ApplyState, FormData>(applySmp, { status: "idle" });
  const [started] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "unavailable" ? state.values : {};

  useEffect(() => {
    if (state.status === "invalid") {
      const first = ORDER.find((k) => errors[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
    if (state.status === "sent") doneRef.current?.focus();
    if (state.status === "unavailable") alertRef.current?.focus();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="mc-panel p-6 outline-none md:p-8">
        <p className="mc-title text-aqua">Bewerbung erhalten</p>
        <p className="mt-4 text-ink/85">
          Danke, {state.ign}. Wir lesen jede Bewerbung selbst und melden uns per E-Mail oder Discord.
        </p>
      </div>
    );
  }

  const err = (k: ApplyField) =>
    errors[k] ? (
      <p id={`smp-${k}-error`} className="mt-2 text-[0.875rem] text-danger">{errors[k]}</p>
    ) : null;
  const aria = (k: ApplyField) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `smp-${k}-error` : undefined,
  });

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="t" value={started} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.status === "unavailable" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="mc-panel p-5 outline-none">
          <p className="font-medium">Die Bewerbung konnte gerade nicht übermittelt werden.</p>
          <p className="mt-1 text-ink/80">Deine Angaben sind in einer E-Mail vorbereitet, die du mit einem Klick abschicken kannst.</p>
          <a href={state.mailto} className="mc-btn mt-4">E-Mail öffnen</a>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="smp-ign" className="mc-label">Minecraft-Name</label>
          <input id="smp-ign" name="ign" required autoComplete="off" spellCheck={false} maxLength={16} defaultValue={values.ign} className="mc-input" placeholder="Steve" {...aria("ign")} />
          {err("ign")}
        </div>
        <div>
          <label htmlFor="smp-discord" className="mc-label">
            Discord <span className="text-muted">(optional)</span>
          </label>
          <input id="smp-discord" name="discord" autoComplete="off" spellCheck={false} maxLength={40} defaultValue={values.discord} className="mc-input" placeholder="deinname" />
        </div>
      </div>
      <div>
        <label htmlFor="smp-email" className="mc-label">E-Mail</label>
        <input id="smp-email" name="email" type="email" required autoComplete="email" spellCheck={false} defaultValue={values.email} className="mc-input" placeholder="name@mail.ch" {...aria("email")} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="smp-why" className="mc-label">Warum willst du mitspielen?</label>
        <textarea id="smp-why" name="why" required rows={4} maxLength={1500} defaultValue={values.why} className="mc-input min-h-[7rem] resize-y" placeholder="Wer bist du, wie spielst du, wen kennst du schon auf dem Server?" {...aria("why")} />
        {err("why")}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="small max-w-[26rem] text-muted">Wir nutzen deine Angaben nur für die Bewerbung.</p>
        <button type="submit" disabled={pending} className="mc-btn">
          {pending ? "Wird gesendet…" : "Bewerbung abschicken"}
        </button>
      </div>
    </form>
  );
}
