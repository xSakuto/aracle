# Team-Login einrichten (Supabase)

Ohne diese Schritte läuft die Seite normal weiter, mit dem Team aus `data/team.ts`.
Der Login zeigt dann einen Hinweis, dass er noch nicht eingerichtet ist.

## 1. Projekt anlegen

1. Auf supabase.com ein neues Projekt erstellen. Region: **Zürich (eu-central-2)**, wenn verfügbar, sonst Frankfurt.
2. Unter *Project Settings > API* die **Project URL** und den **anon public key** kopieren.

## 2. Datenbank aufsetzen

Im *SQL Editor* nacheinander ausführen:

1. `schema.sql` (Tabellen, Rechte, Profilbild-Speicher)
2. `seed.sql` (das heutige Team, Joel als Admin mit jnef400@gmail.com)

## 3. Login-E-Mail anpassen

*Authentication > Email Templates > Magic Link*: Den Code einfügen, damit man ihn
auch auf einem anderen Gerät eingeben kann. Zum Beispiel:

```html
<h2>Dein Login für Aracle</h2>
<p>Dein Code: <strong>{{ .Token }}</strong></p>
<p>Oder direkt einloggen: <a href="{{ .ConfirmationURL }}">Einloggen</a></p>
```

*Authentication > URL Configuration*:

- **Site URL**: `https://aracle.ch`
- **Redirect URLs**: `https://aracle.ch/auth/callback`, dazu für Vorschauen
  deine Vercel-Vorschau-Adressen (z.B. `https://*.vercel.app/auth/callback`) und lokal `http://localhost:3000/auth/callback`

Hinweis: Der eingebaute Mailversand von Supabase schafft nur wenige Mails pro Stunde.
Für den Alltag reicht das bei einem kleinen Team. Wenn nicht, unter
*Authentication > SMTP* einen eigenen Absender eintragen (z.B. info@arcl.ch).

## 4. Vercel

Unter *Settings > Environment Variables* setzen (Production und Preview):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://aracle.ch
```

Danach neu deployen.

## 5. Team einladen

1. Unter `/login` mit jnef400@gmail.com einloggen.
2. *Team verwalten*: bei jeder Person die Login-E-Mail eintragen.
3. Die Person geht auf `/login`, bekommt einen Code und pflegt Foto, Text und Socials selbst.

Projekte und Rollen vergibt nur ein Admin. Was jemand selbst ändern darf
(Name, Text, Farbe, Foto, Socials), sichert die Datenbank ab, nicht nur die Oberfläche.
