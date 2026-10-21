import Link from "next/link";

export type IndexRow = {
  slug: string;
  title: string;
  category: string;
  desc: string;
  year?: string;
};

// Projektliste: Titel, worum es geht, Sparte, Jahr.
export default function ProjectIndex({ rows }: { rows: IndexRow[] }) {
  return (
    <ul className="tile flex flex-col p-2">
      {rows.map((r, i) => (
        <li key={r.slug} data-reveal style={{ ["--i" as string]: i }}>
          <Link
            href={`/projekte/${r.slug}`}
            className="group grid grid-cols-12 items-baseline gap-x-3 md:gap-x-6 gap-y-1 rounded-[14px] px-4 py-4 transition-[background-color,transform] duration-200 hover:bg-raised active:scale-[0.995] md:px-6"
          >
            <span className="col-span-9 text-[1.1875rem] font-semibold tracking-[-0.02em] md:col-span-3">
              {r.title}
            </span>
            <span className="small nums col-span-3 text-right text-muted md:order-last md:col-span-1">
              {r.year ?? ""}
            </span>
            <span className="col-span-12 text-muted md:col-span-6">{r.desc}</span>
            <span className="small col-span-12 text-muted md:col-span-2">{r.category}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
