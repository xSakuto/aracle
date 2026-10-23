"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { SaveState } from "@/app/dashboard/actions";
import EmojiPicker from "@/components/dashboard/EmojiPicker";
import Markdown, { Inline } from "@/components/news/Markdown";
import { composeMessage, TEMPLATES, TOPICS, topicOf } from "@/data/news";
import { NEWS_TEMPLATES, templatesFor } from "@/data/news-templates";
import { convertShortcodes, type CustomEmoji } from "@/lib/emoji";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export interface NewsFormValues {
  id: string;
  topic: string;
  template: string;
  title: string;
  body: string;
  signature: string;
  useEmbed: boolean;
  imageUrl: string;
  published: boolean;
  publishLocal: string;
}

const IMAGE_TYPES = /^image\/(jpeg|png|webp|gif)$/;
const MAX_IMAGE = 8 * 1024 * 1024;

const MENTIONS = Object.fromEntries(TOPICS.map((t) => [t.key, t.label]));

function Section({ title, help, children }: { title: string; help: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-[#24272c] py-8 first:border-t-0 first:pt-0 lg:grid-cols-[13rem_1fr] lg:gap-8">
      <div className="lg:pt-1.5">
        <h2 className="font-sans text-base font-medium tracking-normal">{title}</h2>
        <p className="dash-help mt-1">{help}</p>
      </div>
      <div className="dash-panel flex min-w-0 flex-col gap-4">{children}</div>
    </section>
  );
}

export default function NewsForm({
  post,
  action,
  emojis,
  defaultSignature,
  canEditSignature,
}: {
  post: NewsFormValues;
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
  emojis: CustomEmoji[];
  defaultSignature: string;
  /** Nur die Leitung darf die Signatur ändern. Der Server erzwingt das ebenfalls. */
  canEditSignature: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [topic, setTopic] = useState(post.topic);
  const [template, setTemplate] = useState(post.template);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [signature, setSignature] = useState(post.signature);
  const [useEmbed, setUseEmbed] = useState(post.useEmbed);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [upload, setUpload] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const [dragging, setDragging] = useState(false);
  const [tplId, setTplId] = useState("");
  const [dirty, setDirty] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastField = useRef<"title" | "body">("body");

  useEffect(() => {
    if (state.ok) setDirty(false);
  }, [state]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  const touch = () => setDirty(true);
  const t = topicOf(topic);
  const available = templatesFor(topic);

  function loadTemplate() {
    const tpl = NEWS_TEMPLATES.find((x) => x.id === tplId);
    if (!tpl) return;
    if ((title.trim() || body.trim()) && !window.confirm("Titel und Text durch die Vorlage ersetzen?")) return;
    setTitle(tpl.title);
    setBody(tpl.body);
    setTemplate(tpl.kind);
    touch();
  }

  function insert(text: string) {
    const which = lastField.current;
    const el = which === "title" ? titleRef.current : bodyRef.current;
    const value = which === "title" ? title : body;
    const set = which === "title" ? setTitle : setBody;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    set(value.slice(0, start) + text + value.slice(end));
    touch();
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  }

  async function uploadImage(file: File) {
    if (!IMAGE_TYPES.test(file.type)) {
      setUpload({ busy: false, error: "Bitte ein Bild wählen (JPG, PNG, WebP oder GIF)." });
      return;
    }
    if (file.size > MAX_IMAGE) {
      setUpload({ busy: false, error: "Das Bild ist grösser als 8 MB." });
      return;
    }
    setUpload({ busy: true });
    try {
      const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const path = `${new Date().getFullYear()}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const supabase = createBrowserSupabase();
      const { error } = await supabase.storage.from("news").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      setImageUrl(supabase.storage.from("news").getPublicUrl(path).data.publicUrl);
      setUpload({ busy: false });
      touch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      setUpload({ busy: false, error: `Hochladen fehlgeschlagen: ${msg}` });
    }
  }

  // Ein Bild in der Zwischenablage (Screenshot, kopiertes Bild) wird hochgeladen. Reiner Text wird normal eingefügt.
  function onPaste(e: React.ClipboardEvent) {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
    if (file && !e.clipboardData.getData("text/plain")) {
      e.preventDefault();
      void uploadImage(file);
    }
  }

  // Vorschau mit denselben Umwandlungen wie beim Speichern
  const conv = (s: string) => convertShortcodes(s, emojis);
  const pTitle = conv(title);
  const pBody = conv(body);
  const pSig = conv(signature);
  const message = composeMessage({ topic, title: pTitle, body: pBody, signature: pSig });
  const parts = Math.max(1, Math.ceil(message.length / 1900));

  return (
    <form action={formAction} onChange={touch} onPaste={onPaste} className="grid gap-10 xl:grid-cols-[1fr_24rem]">
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="image_url" value={imageUrl} />

      <div className="min-w-0">
        <Section title="Thema und Vorlage" help="Das Thema bestimmt Farbe und welche Discord-Rolle gepingt wird.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="topic" className="dash-label">Thema</label>
              <select
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setTplId("");
                }}
                className="dash-input"
              >
                {TOPICS.map((x) => (
                  <option key={x.key} value={x.key}>{x.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="template" className="dash-label">Art</label>
              <select id="template" name="template" value={template} onChange={(e) => setTemplate(e.target.value)} className="dash-input">
                {TEMPLATES.map((x) => (
                  <option key={x.key} value={x.key}>{x.label}</option>
                ))}
              </select>
              <p className="dash-help mt-1">Erscheint als Beschriftung auf der Webseite.</p>
            </div>
          </div>

          <div>
            <label htmlFor="tpl" className="dash-label">Vorlage für {t.label}</label>
            <div className="flex flex-wrap gap-2">
              <select id="tpl" value={tplId} onChange={(e) => setTplId(e.target.value)} className="dash-input max-w-[22rem] flex-1">
                <option value="">Vorlage wählen…</option>
                {available.map((x) => (
                  <option key={x.id} value={x.id}>{x.label}</option>
                ))}
              </select>
              <button type="button" onClick={loadTemplate} disabled={!tplId} className="dash-btn-quiet">
                Vorlage laden
              </button>
            </div>
            <p className="dash-help mt-1">Setzt Titel und Text. Eckige Klammern sind Platzhalter zum Überschreiben.</p>
          </div>
        </Section>

        <Section title="Nachricht" help="So wie du sie in Discord schreiben würdest. Die Überschrift mit Rollen-Ping setzt der Bot selbst.">
          <div>
            <label htmlFor="title" className="dash-label">Titel</label>
            <input
              id="title"
              name="title"
              ref={titleRef}
              required
              minLength={3}
              maxLength={600}
              value={title}
              onFocus={() => (lastField.current = "title")}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=":tools: STATUS-UPDATE: STÖRUNG BEHOBEN"
              className="dash-input"
            />
          </div>

          <div>
            <label htmlFor="body" className="dash-label">Text</label>
            <textarea
              id="body"
              name="body"
              ref={bodyRef}
              rows={14}
              maxLength={8000}
              value={body}
              onFocus={() => (lastField.current = "body")}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Geschätzte User, …"
              className="dash-input font-mono text-[0.8125rem]"
            />
            <p className="dash-help mt-1 flex flex-wrap justify-between gap-x-4">
              <span>**fett**, *kursiv*, `code`, ```ini für Blöcke, - für Listen, [Text](https://link)</span>
              <span className="nums">{pBody.length} / 4000</span>
            </p>
          </div>

          <div>
            <p className="dash-label">Emojis</p>
            <EmojiPicker emojis={emojis} onInsert={insert} />
            <p className="dash-help mt-1">
              Klick fügt das Emoji an der Cursorposition ein (Titel oder Text, je nachdem wo du zuletzt warst). Kürzel
              wie :tools: oder :LUNK: werden beim Speichern automatisch umgewandelt.
            </p>
          </div>
        </Section>

        <Section title="Bild" help="Erscheint auf der Webseite und in Discord. Max. 8 MB.">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) void uploadImage(file);
            }}
            className={`rounded-[10px] border border-dashed p-4 transition-colors ${
              dragging ? "border-aqua bg-[#16222a]" : "border-[#2e3238]"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              aria-label="Bild auswählen"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadImage(file);
                e.target.value = "";
              }}
            />
            {imageUrl ? (
              <div className="flex flex-wrap items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="max-h-40 max-w-full rounded-[8px] object-contain" />
                <div className="flex flex-col items-start gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={upload.busy} className="dash-btn-quiet">
                    {upload.busy ? "Lädt hoch…" : "Anderes Bild wählen"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      touch();
                    }}
                    className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
                  >
                    Bild entfernen
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">
                {upload.busy ? (
                  "Lädt hoch…"
                ) : (
                  <>
                    Bild mit <kbd className="rounded-[4px] bg-[#24272c] px-1.5 py-0.5 text-xs text-ink">Strg + V</kbd> einfügen,
                    hierher ziehen oder{" "}
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-ink underline underline-offset-4">
                      auswählen
                    </button>
                    .
                  </>
                )}
              </p>
            )}
          </div>
          {upload.error && <p role="alert" className="text-sm text-danger">{upload.error}</p>}
          <div>
            <label htmlFor="image_link" className="dash-label">Oder Bild-Link</label>
            <input
              id="image_link"
              type="url"
              inputMode="url"
              spellCheck={false}
              autoComplete="off"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://"
              className="dash-input"
            />
          </div>
        </Section>

        <Section title="Signatur und Format" help="Die Signatur kommt automatisch unter die Nachricht.">
          <div>
            <label htmlFor="signature" className="dash-label">Signatur</label>
            <div className="flex flex-wrap gap-2">
              <input
                id="signature"
                name="signature"
                maxLength={160}
                value={signature}
                readOnly={!canEditSignature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Leer lassen für keine Signatur"
                className={`dash-input max-w-[18rem] flex-1 ${canEditSignature ? "" : "cursor-not-allowed opacity-70"}`}
              />
              {canEditSignature && (
                <button type="button" onClick={() => { setSignature(defaultSignature); touch(); }} className="dash-btn-quiet">
                  Standard
                </button>
              )}
            </div>
            <p className="dash-help mt-1">
              {canEditSignature
                ? "Standard bist du: Joel als Sakuto mit 🪽, alle anderen mit 🔥. Nur du darfst die Signatur ändern."
                : "Deine Signatur wird automatisch gesetzt und kann nur von der Leitung geändert werden."}
            </p>
          </div>

          <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="use_embed"
              checked={useEmbed}
              onChange={(e) => setUseEmbed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--color-aqua)]"
            />
            <span>
              Als Embed senden
              <span className="dash-help mt-0.5 block">Standard ist eine normale Nachricht. Ein Embed hat einen farbigen Rand und eigene Darstellung.</span>
            </span>
          </label>
        </Section>

        <Section title="Veröffentlichung" help="Entwurf bleibt privat. Mit Zeitpunkt in der Zukunft wird der Beitrag geplant.">
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={post.published} className="h-4 w-4 accent-[var(--color-aqua)]" />
            Veröffentlichen
          </label>
          <div className="max-w-[16rem]">
            <label htmlFor="publish_at" className="dash-label">Zeitpunkt</label>
            <input id="publish_at" name="publish_at" type="datetime-local" required defaultValue={post.publishLocal} className="dash-input nums" />
            <p className="dash-help mt-1">
              Schweizer Zeit. Der Bot prüft jede Minute und postet danach in Discord, meist innerhalb von 1 bis 2 Minuten.
              Sofort geht es mit <code>/newssync</code> in Discord.
            </p>
          </div>
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
              <span className="text-muted">Gespeichert</span>
            ) : null}
          </p>
          <button type="submit" disabled={pending} className="dash-btn">Speichern</button>
        </div>
      </div>

      {/* Vorschau: genau die Nachricht, die der Bot postet */}
      <aside aria-label="Vorschau in Discord" className="min-w-0 xl:sticky xl:top-8 xl:self-start">
        <p className="dash-help mb-3 flex justify-between gap-4">
          <span>Vorschau in Discord</span>
          <span className="nums">{message.length} Zeichen{parts > 1 ? `, ca. ${parts} Nachrichten` : ""}</span>
        </p>
        <div className="max-h-[75svh] overflow-y-auto rounded-[10px] bg-[#313338] p-4 text-[0.9375rem] leading-[1.4] text-[#dbdee1]">
          {useEmbed ? (
            <>
              <p className="mb-2">
                <span className="rounded-[3px] bg-[#3c4270] px-0.5 text-[#c9cdfb]">@{t.label}</span>
              </p>
              <div className="overflow-hidden rounded-[4px] border-l-4 bg-[#2b2d31] p-3" style={{ borderLeftColor: t.accent }}>
                <p className="text-xs font-semibold text-[#dbdee1]">{t.label}</p>
                <p className="mt-1 font-semibold text-white"><Inline text={pTitle || "Titel"} variant="discord" /></p>
                <div className="text-[0.8125rem]">
                  {(pBody || pSig) && (
                    <Markdown
                      text={[pBody.trim(), pSig.trim() ? `Cheers,\n**${pSig.trim()}**` : ""].filter(Boolean).join("\n\n")}
                      variant="discord"
                      mentions={MENTIONS}
                    />
                  )}
                </div>
                {/^https:\/\//i.test(imageUrl) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" className="mt-2.5 max-h-56 w-full rounded-[4px] object-cover" />
                )}
                <p className="mt-2 text-[0.6875rem] text-[#949ba4]">aracle.ch/news</p>
              </div>
            </>
          ) : (
            <>
              <Markdown text={message} variant="discord" mentions={MENTIONS} />
              {/^https:\/\//i.test(imageUrl) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="mt-2 max-h-72 max-w-full rounded-[8px] object-contain" />
              )}
            </>
          )}
        </div>
        {parts > 1 && !useEmbed && (
          <p className="dash-help mt-2">Lange Beiträge verteilt der Bot sauber auf mehrere Nachrichten, Code-Blöcke bleiben intakt.</p>
        )}
      </aside>
    </form>
  );
}
