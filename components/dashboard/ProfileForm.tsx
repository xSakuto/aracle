"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Portrait from "@/components/Portrait";
import SocialIcon from "@/components/SocialIcon";
import {
  SOCIAL_LABELS,
  SOCIAL_PLACEHOLDERS,
  SOCIAL_TYPES,
  type Social,
  type SocialType,
} from "@/data/socials";
import type { SaveState } from "@/app/dashboard/actions";
import type { FullProfile } from "@/lib/session";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type ProjectOption = { slug: string; title: string };

// Profilfarben aus der Umgebung: Aqua (Marke), Gletscher, Alpwiese, Himmel,
// Schiefer, Alpenrose, Ocker, Abendrot.
const ACCENTS = ["#00ffff", "#4fb3a9", "#6bbf59", "#5aa9e6", "#7c93c9", "#e48aa3", "#d9a441", "#e5634d"];

function Section({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-[#24272c] py-8 first:border-t-0 first:pt-0 lg:grid-cols-[13rem_1fr] lg:gap-8">
      <div className="lg:pt-1.5">
        <h2 className="font-sans text-base font-medium tracking-normal">{title}</h2>
        <p className="dash-help mt-1">{help}</p>
      </div>
      <div className="dash-panel flex flex-col gap-4">{children}</div>
    </section>
  );
}

export default function ProfileForm({
  profile,
  action,
  admin = false,
  projects,
}: {
  profile: FullProfile;
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
  admin?: boolean;
  projects: ProjectOption[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio);
  const [quote, setQuote] = useState(profile.quote);
  const [contactEmail, setContactEmail] = useState(profile.contact_email ?? "");
  const [accent, setAccent] = useState(profile.accent);
  const [photo, setPhoto] = useState(profile.photo_url ?? "");
  const [socials, setSocials] = useState<Social[]>(profile.socials);
  const [tags, setTags] = useState(profile.projects);
  const [upload, setUpload] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) setDirty(false);
  }, [state]);

  // Warnen, bevor ungespeicherte Änderungen verloren gehen.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  const titleOf = Object.fromEntries(projects.map((p) => [p.slug, p.title]));
  const freeProjects = projects.filter((p) => !tags.some((t) => t.slug === p.slug));

  async function onPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      setUpload({ busy: false, error: "Bitte ein Bild wählen (JPG, PNG oder WebP)." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUpload({ busy: false, error: "Das Bild ist grösser als 5 MB." });
      return;
    }
    setUpload({ busy: true });
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const supabase = createBrowserSupabase();
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      setUpload({ busy: false, error: `Hochladen fehlgeschlagen: ${error.message}` });
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setPhoto(data.publicUrl);
    setDirty(true);
    setUpload({ busy: false });
  }

  const touch = () => setDirty(true);

  return (
    <form
      action={formAction}
      onChange={touch}
      className="grid gap-10 xl:grid-cols-[1fr_20rem]"
    >
      <input type="hidden" name="id" value={profile.id} />
      <input type="hidden" name="photo_url" value={photo} />
      <input type="hidden" name="accent" value={accent} />
      <input type="hidden" name="socials" value={JSON.stringify(socials)} />
      {admin && <input type="hidden" name="projects" value={JSON.stringify(tags)} />}

      <div>
        <Section title="Profil" help="So erscheinst du auf der Teamseite.">
          <div>
            <label htmlFor="name" className="dash-label">Name</label>
            <input
              id="name"
              name="name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dash-input"
            />
          </div>

          {admin ? (
            <div>
              <label htmlFor="role" className="dash-label">Rolle</label>
              <input
                id="role"
                name="role"
                maxLength={80}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="z.B. Creative & Photography"
                className="dash-input"
              />
            </div>
          ) : (
            <div>
              <p className="dash-label">Rolle</p>
              <p className="text-sm">{profile.role || "Noch keine Rolle"}</p>
              <p className="dash-help mt-1">Die Rolle legt Joel fest.</p>
            </div>
          )}

          <div>
            <label htmlFor="bio" className="dash-label">Kurzbeschreibung</label>
            <textarea
              id="bio"
              name="bio"
              maxLength={400}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Was machst du bei Aracle? Zwei, drei Sätze reichen."
              className="dash-input"
            />
            <p className="dash-help mt-1 text-right nums">{bio.length} / 400</p>
          </div>

          <div>
            <label htmlFor="quote" className="dash-label">Persönliches Zitat</label>
            <textarea
              id="quote"
              name="quote"
              maxLength={200}
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Ein Satz, der zu dir passt. Ohne Anführungszeichen."
              className="dash-input !min-h-0"
            />
            <p className="dash-help mt-1 flex justify-between gap-4">
              <span>Erscheint auf der Startseite und unter Team.</span>
              <span className="nums">{quote.length} / 200</span>
            </p>
          </div>

          <div>
            <label htmlFor="contact_email" className="dash-label">Öffentliche E-Mail</label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              autoComplete="off"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="vorname@aracle.ch"
              className="dash-input"
            />
            <p className="dash-help mt-1">Wird öffentlich angezeigt. Leer lassen, wenn du keine willst. Dein Login bleibt privat.</p>
          </div>

          <div>
            <p className="dash-label">Profilfarbe</p>
            <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Profilfarbe">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={accent === c}
                  aria-label={`Farbe ${c}`}
                  onClick={() => {
                    setAccent(c);
                    touch();
                  }}
                  className={`h-8 w-8 rounded-full transition-transform active:scale-90 ${
                    accent === c ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <p className="dash-help mt-2">Wird für dein Platzhalterbild genutzt, solange kein Foto da ist.</p>
          </div>
        </Section>

        <Section title="Foto" help="Hochformat wirkt am besten, mindestens 800 Pixel breit. Max. 5 MB.">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              id="photo-file"
              onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={upload.busy}
              className="dash-btn-quiet"
            >
              {upload.busy ? "Lädt hoch…" : photo ? "Anderes Foto wählen" : "Foto hochladen"}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => {
                  setPhoto("");
                  touch();
                }}
                className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Foto entfernen
              </button>
            )}
          </div>
          {upload.error && <p role="alert" className="text-sm text-danger">{upload.error}</p>}
        </Section>

        <Section
          title="Social Media"
          help="Deine eigenen Kanäle. Sie erscheinen als Symbole unter deinem Profil."
        >
          {socials.length === 0 && (
            <p className="text-sm text-muted">Noch keine Links. Füg deinen ersten hinzu.</p>
          )}
          <ul className="flex flex-col gap-2">
            {socials.map((s, i) => (
              <li key={i} className="grid grid-cols-[8.5rem_1fr_auto] gap-2">
                <label className="sr-only" htmlFor={`social-type-${i}`}>Plattform</label>
                <select
                  id={`social-type-${i}`}
                  value={s.type}
                  onChange={(e) => {
                    const next = [...socials];
                    next[i] = { ...s, type: e.target.value as SocialType };
                    setSocials(next);
                  }}
                  className="dash-input"
                >
                  {SOCIAL_TYPES.map((t) => (
                    <option key={t} value={t}>{SOCIAL_LABELS[t]}</option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={`social-url-${i}`}>Link</label>
                <input
                  id={`social-url-${i}`}
                  type="url"
                  inputMode="url"
                  spellCheck={false}
                  autoComplete="off"
                  value={s.url}
                  placeholder={SOCIAL_PLACEHOLDERS[s.type]}
                  onChange={(e) => {
                    const next = [...socials];
                    next[i] = { ...s, url: e.target.value };
                    setSocials(next);
                  }}
                  className="dash-input"
                />
                <button
                  type="button"
                  aria-label={`${SOCIAL_LABELS[s.type]} entfernen`}
                  onClick={() => {
                    setSocials(socials.filter((_, j) => j !== i));
                    touch();
                  }}
                  className="grid h-10 w-10 place-items-center rounded-[6px] text-muted transition-colors hover:bg-[#24272c] hover:text-ink active:scale-95"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {socials.length < 12 && (
            <button
              type="button"
              onClick={() => {
                const unused = SOCIAL_TYPES.find((t) => !socials.some((s) => s.type === t)) ?? "website";
                setSocials([...socials, { type: unused, url: "" }]);
                touch();
              }}
              className="dash-btn-quiet self-start"
            >
              Link hinzufügen
            </button>
          )}
        </Section>

        <Section
          title="Projekte"
          help={admin ? "Woran diese Person beteiligt ist, mit Rolle im Projekt." : "Woran du beteiligt bist. Die Zuordnung macht Joel."}
        >
          {tags.length === 0 && <p className="text-sm text-muted">Noch keinem Projekt zugeordnet.</p>}
          <ul className="flex flex-col gap-2">
            {tags.map((t, i) => (
              <li key={t.slug} className={admin ? "grid grid-cols-[1fr_10rem_auto] items-center gap-2" : "flex items-baseline justify-between gap-4 text-sm"}>
                <span className="text-sm font-medium">{titleOf[t.slug] ?? t.slug}</span>
                {admin ? (
                  <>
                    <label className="sr-only" htmlFor={`tag-role-${i}`}>Rolle in {titleOf[t.slug]}</label>
                    <input
                      id={`tag-role-${i}`}
                      value={t.role}
                      placeholder="Rolle"
                      onChange={(e) => {
                        const next = [...tags];
                        next[i] = { ...t, role: e.target.value };
                        setTags(next);
                      }}
                      className="dash-input"
                    />
                    <button
                      type="button"
                      aria-label={`${titleOf[t.slug]} entfernen`}
                      onClick={() => {
                        setTags(tags.filter((x) => x.slug !== t.slug));
                        touch();
                      }}
                      className="grid h-10 w-10 place-items-center rounded-[6px] text-muted transition-colors hover:bg-[#24272c] hover:text-ink active:scale-95"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <span className="text-muted">{t.role}</span>
                )}
              </li>
            ))}
          </ul>
          {admin && freeProjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <label className="sr-only" htmlFor="add-project">Projekt hinzufügen</label>
              <select
                id="add-project"
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  setTags([...tags, { slug: e.target.value, role: "" }]);
                  e.target.value = "";
                  touch();
                }}
                className="dash-input max-w-[16rem]"
              >
                <option value="">Projekt hinzufügen…</option>
                {freeProjects.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.title}</option>
                ))}
              </select>
            </div>
          )}
        </Section>

        {admin && (
          <Section title="Zugang & Anzeige" help="Login-E-Mail, Rechte und wo die Person auf der Teamseite steht.">
            <div>
              <label htmlFor="email" className="dash-label">Login-E-Mail</label>
              <input
                id="email"
                name="email"
                type="email"
                spellCheck={false}
                autoComplete="off"
                defaultValue={profile.email ?? ""}
                placeholder="name@beispiel.ch"
                className="dash-input"
              />
              <p className="dash-help mt-1">
                {profile.user_id
                  ? "Hat sich schon eingeloggt."
                  : "Mit dieser Adresse kann sich die Person selbst einloggen."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["visible", "Auf der Teamseite zeigen", profile.visible],
                  ["is_lead", "Oben als Leitung zeigen", profile.is_lead],
                  ["is_admin", "Darf das Team verwalten", profile.is_admin],
                ] as const
              ).map(([key, label, on]) => (
                <label key={key} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" name={key} defaultChecked={on} className="h-4 w-4 accent-[var(--color-aqua)]" />
                  {label}
                </label>
              ))}
            </div>
            <div className="max-w-[10rem]">
              <label htmlFor="sort" className="dash-label">Reihenfolge</label>
              <input id="sort" name="sort" type="number" min={0} max={9999} defaultValue={profile.sort} className="dash-input nums" />
              <p className="dash-help mt-1">Kleinere Zahl steht weiter oben.</p>
            </div>
          </Section>
        )}

        <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center justify-end gap-4 bg-bg px-1 py-4">
          <p aria-live="polite" className="text-sm">
            {state.error ? (
              <span className="text-danger">{state.error}</span>
            ) : pending ? (
              <span className="text-muted">Speichert…</span>
            ) : dirty ? (
              <span className="text-muted">Ungespeicherte Änderungen</span>
            ) : state.ok ? (
              <span className="text-muted">Gespeichert</span>
            ) : null}
          </p>
          <button type="submit" disabled={pending || upload.busy} className="dash-btn">
            Änderungen speichern
          </button>
        </div>
      </div>

      {/* Vorschau: genau so steht es auf der Teamseite */}
      <aside aria-label="Vorschau auf der Teamseite" className="xl:sticky xl:top-8 xl:self-start">
        <p className="dash-help mb-3">Vorschau auf der Teamseite</p>
        <div className="dash-panel">
          <div className="w-40">
            <Portrait name={name || "?"} photo={photo || undefined} accent={accent} eager />
          </div>
          <p className="mt-4 font-display text-2xl leading-tight">{name || "Dein Name"}</p>
          <p className="mt-1 text-sm text-muted">{(admin ? role : profile.role) || "Rolle"}</p>
          <p className="mt-3 text-sm leading-relaxed">{bio || "Deine Kurzbeschreibung erscheint hier."}</p>
          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <li key={t.slug} className="bg-raised px-2.5 py-1 text-xs">{titleOf[t.slug] ?? t.slug}</li>
              ))}
            </ul>
          )}
          {socials.some((s) => s.url.trim()) && (
            <ul className="mt-4 flex gap-3 text-ink">
              {socials
                .filter((s) => s.url.trim())
                .map((s, i) => (
                  <li key={i} title={SOCIAL_LABELS[s.type]}>
                    <SocialIcon type={s.type} className="h-4 w-4" />
                  </li>
                ))}
            </ul>
          )}
        </div>
      </aside>
    </form>
  );
}
