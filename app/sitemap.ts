import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

// Alle öffentlichen Seiten. Projekte mit eigener Landing Page erscheinen nur einmal, unter der Landing Page.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/projekte", 0.9, "weekly"),
    page("/hosting", 0.9),
    page("/highside", 0.8),
    page("/swizzly", 0.8),
    page("/rexusmods", 0.7),
    page("/smp", 0.7),
    page("/zelda-de", 0.8),
    page("/zelda-de/regelwerk", 0.6),
    page("/team", 0.7),
    page("/apply", 0.6),
    page("/history", 0.5),
    page("/brand", 0.4),
    page("/kontakt", 0.7),
    page("/impressum", 0.2, "yearly"),
    page("/datenschutz", 0.2, "yearly"),
    ...projects.filter((p) => !p.landing).map((p) => page(`/projekte/${p.slug}`, 0.6)),
  ];
}
