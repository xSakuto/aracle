// Regelwerk der Zelda-Community DE. Überarbeitete Fassung des Google Docs (Oktober 2026):
// gleiche Inhalte, neu gegliedert, doppelte Nummern bereinigt.
export const RULES_UPDATED = "Oktober 2026";

export const rules: { id: string; title: string; items: string[] }[] = [
  {
    id: "profil",
    title: "Profil",
    items: [
      "Nickname, Profilbild und Status dürfen keine beleidigenden, anstössigen oder verbotenen Inhalte zeigen. Ein unpassender Nickname kann zum Bann führen.",
      "Im Status sind keine externen Links und keine Werbung erlaubt.",
    ],
  },
  {
    id: "umgang",
    title: "Umgang miteinander",
    items: [
      "Sei freundlich, im Text- wie im Sprachchat. Beleidigungen, Angriffe und Drohungen sind verboten.",
      "Achte im Sprachchat auf deine Umgebung und vermeide störende Hintergrundgeräusche.",
      "Channel-Hopping, also wiederholtes Betreten und Verlassen von Sprachkanälen, ist verboten.",
      "Gespräche dürfen nur aufgenommen werden, wenn alle Anwesenden ausdrücklich zustimmen.",
      "Teile niemals private Daten öffentlich, weder deine eigenen noch die von anderen. Das Team fragt dich nie nach sensiblen Daten.",
      "Wenn du einen Regelverstoss bemerkst, melde ihn dem Team.",
    ],
  },
  {
    id: "team",
    title: "Team und Rollen",
    items: [
      "Das Team darf Mitglieder kicken und bannen und hat volles Weisungsrecht. Wer Anweisungen des Teams verweigert, kann gebannt werden.",
      "Discord-Rollen werden nicht beliebig vergeben. Betteln um Rollen ist nicht erlaubt.",
      "Für Support schreibst du dem Team keine privaten Nachrichten, sondern eröffnest ein Ticket.",
    ],
  },
  {
    id: "sicherheit",
    title: "Sicherheit und Bots",
    items: [
      "Angriffe auf den Server oder auf Mitglieder, etwa DDoS, sind verboten, werden mit einem dauerhaften IP-Bann geahndet und können strafrechtlich verfolgt werden.",
      "Eigene Bots brauchen die Freigabe des Teams und das Einverständnis der Betroffenen.",
      "Fake-Accounts führen zu einem dauerhaften Bann.",
      "Den Server-Bot nutzt du nur in den Kanälen, die dafür vorgesehen sind. Sonst gibt es einen Timeout.",
    ],
  },
  {
    id: "spoiler",
    title: "Spoiler",
    items: [
      "Alles aus Tears of the Kingdom, was über die erste Himmelsinsel hinausgeht, markierst du als Spoiler.",
      "Das gilt besonders für Orte, Bosse, wichtige Story-Momente, Rätsel, Ausrüstung und Fähigkeiten aus dem späteren Spiel, wichtige Figuren und DLC-Inhalte.",
      "So markierst du einen Spoiler: zwei senkrechte Striche davor und danach, also ||Spoiler||.",
    ],
  },
  {
    id: "weiteres",
    title: "Weiteres",
    items: [
      "Externe Links nur mit Kontext.",
      "Werbung jeder Art ist verboten, auch über Audio, Profilbilder oder Direktnachrichten.",
      "Handel mit Echtgeld wird nicht toleriert.",
    ],
  },
];

export const closing = [
  "Es gelten zusätzlich die Nutzungsbedingungen und Community-Richtlinien von Discord.",
  "Die Regeln können nach Bedarf geändert oder ergänzt werden. Wer gegen eine oder mehrere Regeln verstösst, kann den Zugang zum Server verlieren.",
];
