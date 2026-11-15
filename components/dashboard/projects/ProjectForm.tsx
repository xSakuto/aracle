"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { SaveState } from "@/app/dashboard/actions";
import { PILLARS, STATUS_ORDER, type GalleryItem, type Project } from "@/data/projects";
import { createBrowserSupabase } from "@/lib/supabase/browser";

function Section({ title, help, children }: { title: string; help: string; children: React.ReactNode }) {
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

function Field({ id, label, help, children }: { id: string; label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="dash-label">{label}</label>
      {children}
      {help && <p className="dash-help mt-1">{help}</p>}
    </div>
  );
}

// Liste aus einzelnen Begriffen (Leistungen, Technik, Geplant)
function Tags({ name, value, onChange, placeholder }: { name: string; value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((t) => (
            <li key={t} className="inline-flex items-center gap-1 rounded-full bg-raised py-1 pl-3 pr-1 text-sm">
              {t}
              <button
                type="button"
                aria-label={`${t} entfernen`}
                onClick={() => onChange(value.filter((x) => x !== t))}
                className="grid h-6 w-6 place-items-center rounded-full text-muted transition-colors hover:bg-[#2e3238] hover:text-ink active:scale-90"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="dash-input"
          aria-label={placeholder}
        />
        <button type="button" onClick={add} className="dash-btn-quiet">Hinzufügen</button>
      </div>
    </div>
  );
}

// Liste aus Paaren (Titel und Text), z. B. Bausteine, Verlauf, Links, Fragen
function Pairs<A extends string, B extends string>({
  name,
  value,
  onChange,
  a,
  b,
  labelA,
  labelB,
  longB = false,
  addLabel,
}: {
  name: string;
  value: Record<A | B, string>[];
  onChange: (v: Record<A | B, string>[]) => void;
  a: A;
  b: B;
  labelA: string;
  labelB: string;
  longB?: boolean;
  addLabel: string;
}) {
  const set = (i: number, k: A | B, v: string) => onChange(value.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const copy = [...value];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      <ol className="flex flex-col gap-3">
        {value.map((x, i) => (
          <li key={i} className="grid gap-2 rounded-[10px] border border-[#24272c] p-3 sm:grid-cols-[12rem_1fr_auto]">
            <input value={x[a]} onChange={(e) => set(i, a, e.target.value)} placeholder={labelA} aria-label={labelA} className="dash-input" />
            {longB ? (
              <textarea value={x[b]} onChange={(e) => set(i, b, e.target.value)} placeholder={labelB} aria-label={labelB} rows={2} className="dash-input !min-h-[2.5rem]" />
            ) : (
              <input value={x[b]} onChange={(e) => set(i, b, e.target.value)} placeholder={labelB} aria-label={labelB} className="dash-input" />
            )}
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} aria-label="Nach oben" className="dash-btn-quiet !px-2.5">↑</button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Nach unten" className="dash-btn-quiet !px-2.5">↓</button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Entfernen" className="dash-btn-quiet !px-2.5">×</button>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...value, { [a]: "", [b]: "" } as Record<A | B, string>])}
        className="dash-btn-quiet mt-3"
      >
        {addLabel}
      </button>
    </div>
  );
}

async function uploadImage(slug: string, file: File): Promise<{ url?: string; width?: number; height?: number; error?: string }> {
  if (!file.type.startsWith("image/")) return { error: "Bitte ein Bild wählen (JPG, PNG, WebP oder GIF)." };
  if (file.size > 8 * 1024 * 1024) return { error: "Das Bild ist grösser als 8 MB." };
  const dims = await new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1600, height: 1000 });
    img.src = URL.createObjectURL(file);
  });
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${slug}/${Date.now()}.${ext}`;
  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from("projects").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) return { error: `Hochladen fehlgeschlagen: ${error.message}` };
  return { url: supabase.storage.from("projects").getPublicUrl(path).data.publicUrl, ...dims };
}

export default function ProjectForm({
  project,
  hidden,
  action,
  isCustom,
}: {
  project: Project;
  hidden: boolean;
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
  /** Im Dashboard angelegt, nicht in data/projects.ts */
  isCustom: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [dirty, setDirty] = useState(false);
  const [scope, setScope] = useState(project.scope);
  const [tech, setTech] = useState(project.techStack);
  const [next, setNext] = useState(project.next ?? []);
  const [includes, setIncludes] = useState(project.includes);
  const [timeline, setTimeline] = useState(project.timeline);
  const [links, setLinks] = useState(project.links);
  const [faq, setFaq] = useState(project.faq ?? []);
  const [cover, setCover] = useState(project.coverImage ?? "");
  const [gallery, setGallery] = useState<GalleryItem[]>(project.gallery ?? []);
  const [upload, setUpload] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const touch = () => setDirty(true);
  const wrap = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    touch();
  };

  useEffect(() => {
    if (state.ok) setDirty(false);
  }, [state]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function onCover(file: File) {
    setUpload({ busy: true });
    const res = await uploadImage(project.slug, file);
    if (res.error) return setUpload({ busy: false, error: res.error });
    setCover(res.url!);
    touch();
    setUpload({ busy: false });
  }

  async function onGallery(files: FileList) {
    setUpload({ busy: true });
    const added: GalleryItem[] = [];
    for (const f of Array.from(files)) {
      const res = await uploadImage(project.slug, f);
      if (res.error) {
        setUpload({ busy: false, error: res.error });
        break;
      }
      added.push({ kind: "photo", src: res.url!, alt: `${project.title}`, width: res.width!, height: res.height! });
    }
    setGallery((g) => [...g, ...added]);
    if (added.length) touch();
    setUpload((u) => ({ ...u, busy: false }));
  }

  const setItem = (i: number, patch: Partial<GalleryItem>) =>
    setGallery((g) => g.map((x, j) => (j === i ? ({ ...x, ...patch } as GalleryItem) : x)));

  return (
    <form action={formAction} onChange={touch} className="max-w-[60rem]">
      <input type="hidden" name="slug" value={project.slug} />
      <input type="hidden" name="coverImage" value={cover} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />

      <Section title="Grunddaten" help="Was in Kacheln und im Kopf der Projektseite steht.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="title" label="Titel">
            <input id="title" name="title" required minLength={2} maxLength={80} defaultValue={project.title} className="dash-input" />
          </Field>
          <Field id="category" label="Kategorie" help="Z. B. «App, Flutter» oder «Minecraft-Modpack».">
            <input id="category" name="category" maxLength={60} defaultValue={project.category} className="dash-input" />
          </Field>
        </div>
        <Field id="tagline" label="Tagline" help="Eine Zeile auf Englisch, wie die Headlines der Website.">
          <input id="tagline" name="tagline" maxLength={140} defaultValue={project.tagline} className="dash-input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="status" label="Status">
            <select id="status" name="status" defaultValue={project.status} className="dash-input">
              {STATUS_ORDER.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field id="pillar" label="Bereich">
            <select id="pillar" name="pillar" defaultValue={project.pillar} className="dash-input">
              {PILLARS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field id="year" label="Seit">
            <input id="year" name="year" inputMode="numeric" pattern="\d{4}" maxLength={4} defaultValue={project.year} className="dash-input nums" />
          </Field>
        </div>
        <Field id="owner" label="Verantwortlich" help="Nur sichtbar, wenn niemand aus dem Team zugeordnet ist.">
          <input id="owner" name="owner" maxLength={80} defaultValue={project.owner} className="dash-input" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" name="featured" defaultChecked={Boolean(project.featured)} className="h-4 w-4 accent-[var(--color-aqua)]" />
            In der Übersicht breit zeigen
          </label>
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" name="hidden" defaultChecked={hidden} className="h-4 w-4 accent-[var(--color-aqua)]" />
            Auf der Website verstecken
          </label>
        </div>
        {isCustom && hidden && (
          <p className="dash-help">Neue Projekte sind zuerst versteckt. Häkchen entfernen, sobald alles drin ist.</p>
        )}
      </Section>

      <Section title="Texte" help="Kurzbeschreibung für Kacheln und Suchmaschinen, der Rest für die Projektseite.">
        <Field id="shortDescription" label="Kurzbeschreibung">
          <textarea id="shortDescription" name="shortDescription" maxLength={240} rows={2} defaultValue={project.shortDescription} className="dash-input" />
        </Field>
        <Field id="longDescription" label="Worum geht es?">
          <textarea id="longDescription" name="longDescription" maxLength={2000} rows={5} defaultValue={project.longDescription} className="dash-input" />
        </Field>
        <Field id="goal" label="Ziel">
          <textarea id="goal" name="goal" maxLength={400} rows={2} defaultValue={project.goal} className="dash-input" />
        </Field>
        <div>
          <p className="dash-label">Was Aracle beiträgt</p>
          <Tags name="scope" value={scope} onChange={wrap(setScope)} placeholder="z. B. Branding" />
        </div>
        <div>
          <p className="dash-label">Technik</p>
          <Tags name="techStack" value={tech} onChange={wrap(setTech)} placeholder="z. B. Flutter" />
        </div>
      </Section>

      <Section title="Was dazugehört" help="Die Bausteine des Projekts, je mit kurzer Erklärung.">
        <Pairs name="includes" value={includes} onChange={wrap(setIncludes)} a="title" b="text" labelA="Baustein" labelB="Erklärung" longB addLabel="Baustein hinzufügen" />
      </Section>

      <Section title="Bilder" help="Titelbild für Kopf und Kachel, dazu die Galerie unter «Einblicke». Platzhalter zeigen, welches Bild noch fehlt.">
        <div className="flex flex-wrap items-start gap-4">
          <div className="aspect-[16/10] w-56 overflow-hidden rounded-[10px] bg-raised">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="Titelbild" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full place-items-center text-xs text-muted">Kein Titelbild</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input ref={coverRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onCover(e.target.files[0])} />
            <button type="button" disabled={upload.busy} onClick={() => coverRef.current?.click()} className="dash-btn-quiet">
              Titelbild hochladen
            </button>
            <p className="dash-help max-w-[22rem]">Querformat, mindestens 1600 px breit.</p>
          </div>
        </div>

        <div>
          <p className="dash-label">Galerie</p>
          {gallery.length > 0 && (
            <ul className="mb-3 grid gap-3 sm:grid-cols-2">
              {gallery.map((g, i) => (
                <li key={i} className="flex gap-3 rounded-[10px] border border-[#24272c] p-3">
                  <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-[6px] bg-raised">
                    {g.kind === "photo" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={g.src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center border border-dashed border-[#3a3f47] text-[0.6875rem] text-muted">Platzhalter</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {g.kind === "photo" && (
                      <input value={g.alt} onChange={(e) => { setItem(i, { alt: e.target.value }); touch(); }} placeholder="Was ist zu sehen? (für Screenreader)" aria-label="Bildbeschreibung" className="dash-input !h-8" />
                    )}
                    <input value={g.caption ?? ""} onChange={(e) => { setItem(i, { caption: e.target.value }); touch(); }} placeholder="Bildunterschrift" aria-label="Bildunterschrift" className="dash-input !h-8" />
                    <div className="flex gap-1">
                      <button type="button" aria-label="Nach vorne" className="dash-btn-quiet !h-7 !px-2" onClick={() => { if (i > 0) { setGallery((x) => { const c = [...x]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c; }); touch(); } }}>←</button>
                      <button type="button" aria-label="Nach hinten" className="dash-btn-quiet !h-7 !px-2" onClick={() => { if (i < gallery.length - 1) { setGallery((x) => { const c = [...x]; [c[i + 1], c[i]] = [c[i], c[i + 1]]; return c; }); touch(); } }}>→</button>
                      <button type="button" className="dash-btn-quiet !h-7 !px-2" onClick={() => { setGallery((x) => x.filter((_, j) => j !== i)); touch(); }}>Entfernen</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files?.length && onGallery(e.target.files)} />
            <button type="button" disabled={upload.busy} onClick={() => galleryRef.current?.click()} className="dash-btn-quiet">
              {upload.busy ? "Lädt hoch…" : "Bilder hochladen"}
            </button>
            <button type="button" onClick={() => { setGallery((g) => [...g, { kind: "slot", motif: "photo", caption: "Bild folgt" }]); touch(); }} className="dash-btn-quiet">
              Platzhalter hinzufügen
            </button>
          </div>
          {upload.error && <p role="alert" className="mt-2 text-sm text-danger">{upload.error}</p>}
        </div>
      </Section>

      <Section title="Verlauf" help="Meilensteine mit Jahr. «Geplant» erscheint gestrichelt am Ende.">
        <Pairs name="timeline" value={timeline} onChange={wrap(setTimeline)} a="date" b="label" labelA="Jahr" labelB="Was passiert ist" addLabel="Meilenstein hinzufügen" />
        <div>
          <p className="dash-label">Geplant</p>
          <Tags name="next" value={next} onChange={wrap(setNext)} placeholder="z. B. App für iOS" />
        </div>
      </Section>

      <Section title="Links" help="Der erste externe Link wird im Kopf der Projektseite zum Button.">
        <Pairs name="links" value={links} onChange={wrap(setLinks)} a="label" b="url" labelA="Beschriftung" labelB="https://…" addLabel="Link hinzufügen" />
      </Section>

      <Section title="Fragen" help="Nur Fragen mit gesicherter Antwort. Erscheinen zum Aufklappen.">
        <Pairs name="faq" value={faq} onChange={wrap(setFaq)} a="q" b="a" labelA="Frage" labelB="Antwort" longB addLabel="Frage hinzufügen" />
      </Section>

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center justify-end gap-4 bg-bg px-1 py-4">
        <p aria-live="polite" className="text-sm">
          {state.error ? (
            <span className="text-danger">{state.error}</span>
          ) : pending ? (
            <span className="text-muted">Speichert…</span>
          ) : dirty ? (
            <span className="text-muted">Ungespeicherte Änderungen</span>
          ) : state.ok ? (
            <span className="text-muted">Gespeichert, auf der Website innert einer Minute sichtbar</span>
          ) : null}
        </p>
        <button type="submit" disabled={pending || upload.busy} className="dash-btn">
          Änderungen speichern
        </button>
      </div>
    </form>
  );
}
