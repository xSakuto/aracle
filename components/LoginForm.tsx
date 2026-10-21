"use client";

import { useActionState, useState } from "react";
import {
  requestCode,
  verifyCode,
  type LoginState,
} from "@/app/(site)/login/actions";

export default function LoginForm({ next, linkError }: { next: string; linkError?: boolean }) {
  const [sent, setSent] = useState<LoginState | null>(null);
  const [emailState, emailAction, emailPending] = useActionState(
    async (prev: LoginState, form: FormData) => {
      const res = await requestCode(prev, form);
      if (res.step === "code") setSent(res);
      return res;
    },
    { step: "email", email: "" } as LoginState,
  );
  const [codeState, codeAction, codePending] = useActionState<LoginState, FormData>(
    verifyCode,
    { step: "code", email: "" },
  );

  if (sent) {
    const st: LoginState = codeState.email ? codeState : sent;
    return (
      <form action={codeAction} className="flex flex-col gap-4">
        <input type="hidden" name="weiter" value={next} />
        <input type="hidden" name="email" value={sent.email} />
        <p>{sent.info}</p>
        <div>
          <label htmlFor="code" className="small mb-2 block text-muted">
            6-stelliger Code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            spellCheck={false}
            pattern="[0-9 ]{6,9}"
            required
            autoFocus
            className="field nums text-[1.5rem] tracking-[0.3em]"
          />
        </div>
        {st.error && (
          <p role="alert" className="text-danger">
            {st.error}
          </p>
        )}
        <button type="submit" disabled={codePending} className="btn">
          {codePending ? "Prüft…" : "Einloggen"}
        </button>
        <button
          type="button"
          onClick={() => setSent(null)}
          className="link-under self-start text-muted"
        >
          Andere E-Mail verwenden
        </button>
      </form>
    );
  }

  return (
    <form action={emailAction} className="flex flex-col gap-4">
      <input type="hidden" name="weiter" value={next} />
      <div>
        <label htmlFor="email" className="small mb-2 block text-muted">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          defaultValue={emailState.email}
          placeholder="name@beispiel.ch"
          className="field"
        />
      </div>
      {(emailState.error || linkError) && (
        <p role="alert" className="text-danger">
          {emailState.error ??
            "Der Link aus der E-Mail ist abgelaufen oder wurde schon benutzt. Fordere einen neuen Code an."}
        </p>
      )}
      <button type="submit" disabled={emailPending} className="btn">
        {emailPending ? "Sendet…" : "Login-Code schicken"}
      </button>
    </form>
  );
}
