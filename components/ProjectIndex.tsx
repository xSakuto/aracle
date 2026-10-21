import Link from "next/link";

export type IndexRow = {
  slug: string;
  title: string;
  category: string;
  desc: string;
  year?: string;
};

// Projektliste wie ein Inhaltsverzeichnis: Titel, worum es geht, Sparte, Jahr.
export default function ProjectIndex({ rows }: { rows: IndexRow[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map((r, i) => (
        <li key={r.slug} data-reveal style={{ ["--i" as string]: i }}>
          <Link
            href={`/projekte/${r.slug}`}
            className="group grid grid-cols-12 items-baseline gap-x-8 gap-y-1 py-5 transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.995] md:-mx-4 md:px-4"
          >
            <span className="lead col-span-10 font-display transition-colors duration-200 group-hover:text-aqua md:col-span-4">
              {r.title}
            </span>
            <span className="small nums col-span-2 text-right text-muted md:order-last md:col-span-1">
              {r.year ?? ""}
            </span>
            <span className="col-span-12 max-w-[52ch] md:col-span-5">{r.desc}</span>
            <span className="small col-span-12 text-muted md:col-span-2">{r.category}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
