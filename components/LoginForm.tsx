"use client";

import { useActionState, useState } from "react";
import {
  requestCode,
  signInWithDiscord,
  verifyCode,
  type LoginState,
} from "@/app/(site)/login/actions";
import SocialIcon from "@/components/SocialIcon";

export default function LoginForm({ next, fehler }: { next: string; fehler?: "link" | "discord" }) {
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
    <div className="flex flex-col gap-6">
      <form action={signInWithDiscord}>
        <input type="hidden" name="weiter" value={next} />
        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-[var(--radius)] bg-[#5865F2] px-5 font-medium text-white transition-[filter,transform] duration-200 hover:brightness-110 focus-visible:brightness-110 active:scale-[0.98]"
        >
          <SocialIcon type="discord" className="h-5 w-5 shrink-0" />
          Mit Discord anmelden
        </button>
        {fehler === "discord" && (
          <p role="alert" className="small mt-3 text-danger">
            Discord-Login hat nicht geklappt. Versuch es nochmal oder nutze die E-Mail unten.
          </p>
        )}
      </form>

      <div className="flex items-center gap-4 text-muted">
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span className="small">oder per E-Mail</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>

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
        {(emailState.error || fehler === "link") && (
          <p role="alert" className="text-danger">
            {emailState.error ??
              "Der Link aus der E-Mail ist abgelaufen oder wurde schon benutzt. Fordere einen neuen Code an."}
          </p>
        )}
        <button type="submit" disabled={emailPending} className="btn">
          {emailPending ? "Sendet…" : "Login-Code schicken"}
        </button>
      </form>
    </div>
  );
}
