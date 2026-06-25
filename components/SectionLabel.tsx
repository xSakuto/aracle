export default function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-aqua">
      <span className="h-px w-8 bg-aqua/60" />
      {children}
    </div>
  );
}
