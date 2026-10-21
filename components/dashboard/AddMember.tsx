"use client";

import { useActionState } from "react";
import { createMember, type SaveState } from "@/app/dashboard/actions";

export default function AddMember() {
  const [state, action, pending] = useActionState<SaveState, FormData>(createMember, {});
  return (
    <form action={action} className="dash-panel grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
      <div>
        <label htmlFor="new-name" className="dash-label">Name</label>
        <input id="new-name" name="name" required maxLength={80} className="dash-input" placeholder="Vor- und Nachname" />
      </div>
      <div>
        <label htmlFor="new-email" className="dash-label">Login-E-Mail</label>
        <input id="new-email" name="email" type="email" spellCheck={false} autoComplete="off" className="dash-input" placeholder="optional" />
      </div>
      <div>
        <label htmlFor="new-role" className="dash-label">Rolle</label>
        <input id="new-role" name="role" maxLength={80} className="dash-input" placeholder="z.B. Video & Schnitt" />
      </div>
      <button type="submit" disabled={pending} className="dash-btn">
        {pending ? "Legt an…" : "Mitglied anlegen"}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-danger sm:col-span-4">{state.error}</p>
      )}
      <p className="dash-help sm:col-span-4">
        Neue Mitglieder sind zuerst versteckt. Du ergänzt Projekte und schaltest sie danach sichtbar.
      </p>
    </form>
  );
}
