import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";
import UpdateEditor, { type UpdateDraft } from "@/components/dashboard/projects/UpdateEditor";
import { projectHref, projects as staticProjects } from "@/data/projects";
import { getProjectRows, mergeProjects } from "@/lib/projects";
import { requireMember } from "@/lib/session";
import { isoToZurichLocal } from "@/lib/zurich-time";
import { resetProject, saveProject } from "../actions";

type Row = {
  id: string;
  version: string;
  title: string;
  body: string;
  published: boolean;
  published_at: string;
  author: { name: string } | null;
};

export default async function ProjectEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ neu?: string; zurueckgesetzt?: string }>;
}) {
  const { slug } = await params;
  const { neu, zurueckgesetzt } = await searchParams;
  const { supabase, me } = await requireMember();
  if (!me) redirect("/dashboard");

  const canEdit = me.is_admin || me.permissions.includes("projekte");
  const isMember = me.projects.some((p) => p.slug === slug);
  if (!canEdit && !isMember) redirect("/dashboard/projekte");

  const rows = await getProjectRows();
  const row = rows.find((r) => r.slug === slug);
  const project = mergeProjects(rows.map((r) => ({ ...r, hidden: false }))).find((p) => p.slug === slug);
  if (!project) notFound();
  const isCustom = !staticProjects.some((p) => p.slug === slug);

  const { data, error } = await supabase
    .from("project_updates")
    .select("id, version, title, body, published, published_at, author:profiles(name)")
    .eq("project_slug", slug)
    .order("published_at", { ascending: false })
    .limit(100);
  const entries: UpdateDraft[] = ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    version: r.version,
    title: r.title,
    body: r.body,
    published: r.published,
    publishedLocal: isoToZurichLocal(r.published_at),
    authorName: r.author?.name,
  }));

  return (
    <div className="max-w-[60rem]">
      <p className="text-sm text-muted">
        <Link href="/dashboard/projekte" className="hover:text-ink">Projekte</Link>
        <span aria-hidden className="mx-2">/</span>
        {project.title}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-sans text-2xl font-medium tracking-normal">{project.title}</h1>
        <Link href={projectHref(project)} target="_blank" className="dash-btn-quiet">Auf der Website ansehen ↗</Link>
      </div>
      {neu && <p className="mt-3 text-sm text-aqua">Projekt angelegt. Es ist noch versteckt, bis du das Häkchen entfernst.</p>}
      {zurueckgesetzt && <p className="mt-3 text-sm text-muted">Zurückgesetzt auf den Stand im Code.</p>}

      <nav aria-label="Abschnitte" className="mt-6 flex gap-1 text-sm">
        {canEdit && <a href="#inhalt-projekt" className="rounded-[6px] px-3 py-1.5 text-muted hover:bg-[#16181b] hover:text-ink">Inhalt</a>}
        <a href="#changelog" className="rounded-[6px] px-3 py-1.5 text-muted hover:bg-[#16181b] hover:text-ink">Changelog</a>
      </nav>

      {canEdit && (
        <div id="inhalt-projekt" className="mt-8 scroll-mt-6">
          {project.landing && (
            <p className="dash-panel mb-6 text-sm">
              {project.title} hat eine eigene Landing Page ({project.landing}). Die Texte hier gelten für Kacheln,
              Übersicht und Teamprofile. Die Landing Page selbst ist im Code gestaltet.
            </p>
          )}
          <ProjectForm project={project} hidden={Boolean(row?.hidden)} action={saveProject} isCustom={isCustom} />
          {row && !isCustom && (
            <form action={resetProject} className="mt-2 border-t border-[#24272c] pt-4">
              <input type="hidden" name="slug" value={slug} />
              <button type="submit" className="text-sm text-muted hover:text-danger">
                Alle Änderungen aus dem Dashboard verwerfen und auf den Stand im Code zurücksetzen
              </button>
            </form>
          )}
        </div>
      )}

      <section id="changelog" className="mt-14 scroll-mt-6" aria-labelledby="cl-title">
        <h2 id="cl-title" className="font-sans text-lg font-medium tracking-normal">Changelog</h2>
        <p className="dash-help mt-1 mb-6">
          Erscheint auf der Projektseite und auf dem Profil der Person, die den Eintrag schreibt.
          {slug === "all-the-clients" && " Versionen von Modrinth kommen automatisch dazu."}
        </p>
        {error ? (
          <div className="dash-panel">
            <p className="font-medium">Datenbank noch nicht vorbereitet</p>
            <p className="dash-help mt-1">Führ <code>supabase/2026-10-projects.sql</code> einmal im Supabase SQL-Editor aus.</p>
          </div>
        ) : (
          <UpdateEditor slug={slug} entries={entries} nowLocal={isoToZurichLocal(new Date().toISOString())} />
        )}
      </section>
    </div>
  );
}
