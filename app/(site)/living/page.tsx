import { redirect } from "next/navigation";

// Aracle Living ist derzeit ein Konzept und keine eigene Dienstleistung mehr.
// Die alte Adresse führt auf die Projektseite.
export default function LivingPage() {
  redirect("/projekte/aracle-living");
}
