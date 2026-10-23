import InquiryBoard, { type Assignee, type InquiryRow } from "@/components/dashboard/InquiryBoard";
import { requirePermission } from "@/lib/session";

export default async function InquiriesPage() {
  const { supabase } = await requirePermission("anfragen");
  const [{ data, error }, { data: people }] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, created_at, name, email, company, project_type, description, budget, status, assigned_to, note")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("profiles")
      .select("id, name, photo_url, accent, is_admin, permissions")
      .order("is_lead", { ascending: false })
      .order("sort"),
  ]);

  const rows = (data ?? []) as InquiryRow[];
  const assignees: Assignee[] = ((people ?? []) as { id: string; name: string; photo_url: string | null; accent: string; is_admin: boolean; permissions: string[] | null }[])
    .filter((p) => p.is_admin || (p.permissions ?? []).includes("anfragen"))
    .map((p) => ({ id: p.id, name: p.name, photo: p.photo_url, accent: p.accent }));

  return (
    <div className="max-w-[88rem]">
      <h1 className="font-sans text-2xl font-medium tracking-normal">Anfragen</h1>
      <p className="mt-1 text-muted">
        {rows.length} Anfragen insgesamt. Auf eine Person ziehen weist zu, dann lässt sie sich mit einer Notiz bearbeiten.
      </p>
      {error && <p role="alert" className="mt-4 text-sm text-danger">Anfragen konnten nicht geladen werden: {error.message}</p>}

      {rows.length === 0 && !error ? (
        <div className="dash-panel mt-8">
          <p className="font-medium">Noch keine Anfragen</p>
          <p className="dash-help mt-1">Sobald jemand das Formular auf /kontakt absendet, erscheint die Anfrage hier.</p>
        </div>
      ) : (
        <InquiryBoard rows={rows} assignees={assignees} />
      )}
    </div>
  );
}
