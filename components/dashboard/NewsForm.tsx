"use client";

import { useActionState, useEffect, useState } from "react";
import type { SaveState } from "@/app/dashboard/actions";
import Rich from "@/components/news/Rich";
import {
  CHANGELOG_TAGS,
  TEMPLATES,
  TOPICS,
  templateOf,
  topicOf,
  type NewsItem,
  type NewsLink,
} from "@/data/news";

export interface NewsFormValues {
  id: string;
  topic: string;
  template: string;
  title: string;
  body: string;
  items: NewsItem[];
  links: NewsLink[];
  imageUrl: string;
  published: boolean;
  publishLocal: string;
}

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

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-[6px] text-muted transition-colors hover:bg-[#24272c] hover:text-ink active:scale-95"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  );
}

const TITLE_HINT: Record<string, string> = {
  update: "z.B. Neue Mod-Version verfügbar",
  status: "z.B. Störung behoben",
  changelog: "z.B. Performance und Stabilität, Version 1.6",
  video: "z.B. Neues Video ist online",
};

export default function NewsForm({
  post,
  action,
}: {
  post: NewsFormValues;
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [topic, setTopic] = useState(post.topic);
  const [template, setTemplate] = useState(post.template);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [items, setItems] = useState<NewsItem[]>(post.items);
  const [links, setLinks] = useState<NewsLink[]>(post.links);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [dirty, setDirty] = useState(false);

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
  const showItems = template === "changelog";
  const tagWidth = Math.max(0, ...items.filter((i) => i.text).map((i) => i.tag.length)) + 3;
  const previewLinks = links.filter((l) => /^https:\/\//i.test(l.url));

  return (
    <form action={formAction} onChange={touch} className="grid gap-10 xl:grid-cols-[1fr_22rem]">
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="items" value={JSON.stringify(showItems ? items : [])} />
      <input type="hidden" name="links" value={JSON.stringify(links)} />

      <div className="min-w-0">
        <Section title="Inhalt" help="Thema bestimmt Farbe und welche Discord-Rolle gepingt wird.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="topic" className="dash-label">Thema</label>
              <select id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="dash-input">
                {TOPICS.map((x) => (
                  <option key={x.key} value={x.key}>{x.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="template" className="dash-label">Vorlage</label>
              <select id="template" name="template" value={template} onChange={(e) => setTemplate(e.target.value)} className="dash-input">
                {TEMPLATES.map((x) => (
                  <option key={x.key} value={x.key}>{x.label}</option>
                ))}
              </select>
              <p className="dash-help mt-1">{templateOf(template).hint}</p>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="dash-label">Titel</label>
            <input
              id="title"
              name="title"
              required
              minLength={3}
              maxLength={140}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={TITLE_HINT[template]}
              className="dash-input"
            />
          </div>

          <div>
            <label htmlFor="body" className="dash-label">Text</label>
            <textarea
              id="body"
              name="body"
              rows={7}
              maxLength={4000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Was gibt es Neues?"
              className="dash-input"
            />
            <p className="dash-help mt-1 flex justify-between gap-4">
              <span>Erlaubt: **fett**, `code` und https-Links.</span>
              <span className="nums">{body.length} / 4000</span>
            </p>
          </div>
        </Section>

        {showItems && (
          <Section title="Änderungen" help="Eine Zeile pro Änderung. Erscheint als Liste mit Markierung.">
            {items.length === 0 && <p className="text-sm text-muted">Noch keine Zeilen.</p>}
            <ul className="flex flex-col gap-2">
              {items.map((it, i) => (
                <li key={i} className="grid grid-cols-[8rem_1fr_auto] gap-2">
                  <label className="sr-only" htmlFor={`tag-${i}`}>Markierung</label>
                  <select
                    id={`tag-${i}`}
                    value={it.tag}
                    onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, tag: e.target.value } : x)))}
                    className="dash-input"
                  >
                    {CHANGELOG_TAGS.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor={`item-${i}`}>Änderung</label>
                  <input
                    id={`item-${i}`}
                    maxLength={200}
                    value={it.text}
                    placeholder="Was wurde geändert?"
                    onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                    className="dash-input"
                  />
                  <RemoveButton
                    label="Zeile entfernen"
                    onClick={() => {
                      setItems(items.filter((_, j) => j !== i));
                      touch();
                    }}
                  />
                </li>
              ))}
            </ul>
            {items.length < 20 && (
              <button
                type="button"
                onClick={() => {
                  setItems([...items, { tag: items.at(-1)?.tag ?? "Updated", text: "" }]);
                  touch();
                }}
                className="dash-btn-quiet self-start"
              >
                Zeile hinzufügen
              </button>
            )}
          </Section>
        )}

        <Section title="Links und Bild" help="Knöpfe unter dem Beitrag, optional ein Bild.">
          {links.length === 0 && <p className="text-sm text-muted">Noch keine Links.</p>}
          <ul className="flex flex-col gap-2">
            {links.map((l, i) => (
              <li key={i} className="grid grid-cols-[9rem_1fr_auto] gap-2">
                <label className="sr-only" htmlFor={`link-label-${i}`}>Beschriftung</label>
                <input
                  id={`link-label-${i}`}
                  maxLength={40}
                  value={l.label}
                  placeholder="Beschriftung"
                  onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  className="dash-input"
                />
                <label className="sr-only" htmlFor={`link-url-${i}`}>Link</label>
                <input
                  id={`link-url-${i}`}
                  type="url"
                  inputMode="url"
                  spellCheck={false}
                  autoComplete="off"
                  value={l.url}
                  placeholder="https://"
                  onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                  className="dash-input"
                />
                <RemoveButton
                  label="Link entfernen"
                  onClick={() => {
                    setLinks(links.filter((_, j) => j !== i));
                    touch();
                  }}
                />
              </li>
            ))}
          </ul>
          {links.length < 6 && (
            <button
              type="button"
              onClick={() => {
                setLinks([...links, { label: "", url: "" }]);
                touch();
              }}
              className="dash-btn-quiet self-start"
            >
              Link hinzufügen
            </button>
          )}
          <div>
            <label htmlFor="image_url" className="dash-label">Bild-Link</label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              inputMode="url"
              spellCheck={false}
              autoComplete="off"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://"
              className="dash-input"
            />
            <p className="dash-help mt-1">Adresse eines Bildes. Hochladen direkt hier folgt später.</p>
          </div>
        </Section>

        <Section title="Veröffentlichung" help="Entwurf bleibt privat. Mit Zeitpunkt in der Zukunft wird der Beitrag geplant.">
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={post.published} className="h-4 w-4 accent-[var(--color-aqua)]" />
            Veröffentlichen
          </label>
          <div className="max-w-[16rem]">
            <label htmlFor="publish_at" className="dash-label">Zeitpunkt</label>
            <input
              id="publish_at"
              name="publish_at"
              type="datetime-local"
              required
              defaultValue={post.publishLocal}
              className="dash-input nums"
            />
            <p className="dash-help mt-1">Schweizer Zeit. Der Bot postet kurz danach in Discord.</p>
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
          <button type="submit" disabled={pending} className="dash-btn">
            Speichern
          </button>
        </div>
      </div>

      {/* Vorschau: so ungefähr sieht es in Discord aus */}
      <aside aria-label="Vorschau in Discord" className="xl:sticky xl:top-8 xl:self-start">
        <p className="dash-help mb-3">Vorschau in Discord</p>
        <div className="rounded-[10px] bg-[#313338] p-4 text-[#dbdee1]">
          <p className="mb-2 text-sm">
            <span className="rounded-[4px] bg-[#3c4270] px-1 py-0.5 text-[#c9cdfb]">@{t.label}</span>
          </p>
          <div className="overflow-hidden rounded-[4px] border-l-4 bg-[#2b2d31] p-3" style={{ borderLeftColor: t.accent }}>
            <p className="font-semibold text-white">{title || "Titel"}</p>
            {body && (
              <p className="mt-1.5 whitespace-pre-line text-[0.8125rem] leading-relaxed">
                <Rich text={body} />
              </p>
            )}
            {showItems && items.some((i) => i.text) && (
              <pre className="mt-2.5 overflow-x-auto rounded-[4px] bg-[#1e1f22] p-2.5 font-mono text-[0.75rem] leading-relaxed">
                {items
                  .filter((i) => i.text)
                  .map((i) => `${i.tag ? `[${i.tag}]` : ""}`.padEnd(tagWidth) + i.text)
                  .join("\n")}
              </pre>
            )}
            {previewLinks.length > 0 && (
              <ul className="mt-2.5 flex flex-col gap-0.5 text-[0.8125rem]">
                {previewLinks.map((l, i) => (
                  <li key={i} className="text-[#00a8fc]">{l.label || l.url}</li>
                ))}
              </ul>
            )}
            {/^https:\/\//i.test(imageUrl) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="mt-2.5 max-h-48 w-full rounded-[4px] object-cover" />
            )}
          </div>
        </div>
      </aside>
    </form>
  );
}
