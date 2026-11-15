// Erscheint sofort beim Wechsel zwischen Dashboard-Seiten, während die Daten laden.
export default function DashboardLoading() {
  return (
    <div className="max-w-[72rem]" role="status" aria-label="Lädt">
      <div className="dash-skeleton h-7 w-48" />
      <div className="dash-skeleton mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="dash-skeleton h-[6.5rem]" />
        ))}
      </div>
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div className="dash-skeleton h-64" />
        <div className="dash-skeleton h-64" />
      </div>
    </div>
  );
}
