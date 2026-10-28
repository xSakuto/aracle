"use client";

import { useActionState, useState } from "react";
import { createProject } from "@/app/dashboard/projekte/actions";

// Neues Projekt: nur der Titel, der Rest folgt auf der Projektseite im Dashboard.
export default function NewProject() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createProject, {});
  if (!open) {
    return (
      <button type="button" className="dash-btn" onClick={() => setOpen(true)}>
        Neues Projekt
      </button>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-start gap-2">
      <div>
        <label htmlFor="np-title" className="sr-only">Titel</label>
        <input id="np-title" name="title" required minLength={2} maxLength={80} autoFocus placeholder="Titel des Projekts" className="dash-input w-64" />
        {state.error && <p role="alert" className="mt-1 text-xs text-danger">{state.error}</p>}
      </div>
      <button type="submit" disabled={pending} className="dash-btn">Anlegen</button>
      <button type="button" className="dash-btn-quiet" onClick={() => setOpen(false)}>Abbrechen</button>
    </form>
  );
}
