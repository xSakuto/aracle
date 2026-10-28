import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { getTeam } from "@/lib/team";
import { SITE_URL } from "@/lib/site";

// Alle öffentlichen Seiten. Projekte mit eigener Landing Page erscheinen nur einmal, unter der Landing Page.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, team] = await Promise.all([getProjects(), getTeam()]);
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
    page("/news", 0.7, "weekly"),
    page("/team", 0.7),
    page("/apply", 0.6),
    page("/history", 0.5),
    page("/brand", 0.4),
    page("/kontakt", 0.7),
    page("/impressum", 0.2, "yearly"),
    page("/datenschutz", 0.2, "yearly"),
    page("/beer", 0.8),
    ...projects.filter((p) => !p.landing).map((p) => page(`/projekte/${p.slug}`, 0.6)),
    ...team.map((m) => page(`/team/${m.slug}`, 0.5)),
  ];
}
