// Auswahlwerte fürs Anfrageformular. Schlüssel = Werte in der Datenbank.
export const PROJECT_TYPES = [
  { key: "web", label: "Website / Development" },
  { key: "brand", label: "Branding / Design" },
  { key: "video", label: "Video / Content" },
  { key: "hosting", label: "Hosting / Infrastructure" },
  { key: "other", label: "Other / General Inquiry" },
] as const;

export const BUDGETS = [
  { key: "lt2k", label: "Unter CHF 2'000" },
  { key: "2k-5k", label: "CHF 2'000 bis 5'000" },
  { key: "5k-10k", label: "CHF 5'000 bis 10'000" },
  { key: "10k-plus", label: "Über CHF 10'000" },
  { key: "open", label: "Noch offen" },
] as const;

export type ProjectTypeKey = (typeof PROJECT_TYPES)[number]["key"];
export type BudgetKey = (typeof BUDGETS)[number]["key"];

// "smp" kommt nur von der AracleSMP-Seite und erscheint nicht im Kontaktformular.
export const typeLabel = (k: string) =>
  k === "smp" ? "AracleSMP-Bewerbung" : k === "apply" ? "Bewerbung Team" : PROJECT_TYPES.find((t) => t.key === k)?.label ?? k;
export const budgetLabel = (k: string | null | undefined) => (k ? BUDGETS.find((b) => b.key === k)?.label ?? k : "Keine Angabe");
