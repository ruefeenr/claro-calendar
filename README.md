# Claro Calendar

Privater Familienkalender für das Ferienhaus in Claro. Die App ist als schlanker MVP für fünf Familienmitglieder gedacht und fokussiert auf Aufenthalte statt Chat.

## Funktionen

- geschützte Anmeldung für Familienkonten
- Profile mit Name und Farbe
- Monatskalender für Aufenthalte in Claro
- Einträge mit mehreren Personen pro Aufenthalt
- optionale Notizen pro Eintrag
- sichtbare Überschneidungen statt harter Blockierung

## Tech-Stack

- Next.js App Router
- Tailwind CSS
- Supabase Auth + Postgres + Row Level Security
- Vercel für Deployment

## Lokale Einrichtung

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. Umgebungsvariablen anlegen:

   ```bash
   cp .env.example .env.local
   ```

3. Werte in `.env.local` eintragen:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. Migration in Supabase ausführen:
   - Inhalt aus `supabase/migrations/0001_initial_schema.sql` im SQL Editor ausführen
   - wenn dein Projekt schon läuft, zusätzlich `supabase/migrations/0002_add_profile_avatar.sql` ausführen

5. Familienkonten in Supabase anlegen:
   - `Authentication -> Users`
   - pro Person ein Konto anlegen, z.B. für Reto, Miriam, Morena, Alessandra und Enrique
   - nach dem ersten Login kann jede Person Name und Farbe im Profil anpassen

6. App starten:

   ```bash
   npm run dev
   ```

## Datenmodell

### `profiles`

- ein Profil pro eingeloggtem Familienkonto
- enthält `full_name`, `display_color` und `email`

### `stays`

- Kernobjekt für einen Aufenthalt in Claro
- enthält Titel, Zeitraum, Notiz und Creator

### `stay_participants`

- verbindet einen Aufenthalt mit einem oder mehreren Profilen
- so lassen sich Wochenenden für mehrere Personen gemeinsam planen

## Zugriffsmodell

- alle authentifizierten Familienmitglieder dürfen Profile und Aufenthalte sehen
- jede Person darf das eigene Profil pflegen
- Aufenthalte können von ihrem Creator angelegt, geändert und gelöscht werden

Wenn ihr später lieber wollt, dass alle alles bearbeiten dürfen, müssen nur die RLS-Policies angepasst werden.

## Deployment auf Vercel

1. Repository nach GitHub pushen
2. Projekt in Vercel importieren
3. dieselben Supabase-Umgebungsvariablen in Vercel setzen
4. deployen

Empfohlene Production-Checks:

- Login mit einem Testkonto prüfen
- Profil speichern prüfen
- Aufenthalt mit mehreren Personen anlegen
- Überschneidung in derselben Woche prüfen

## Demo-Modus

Wenn noch keine Supabase-Konfiguration gesetzt ist, zeigt die App absichtlich Demo-Daten an. So kannst du UI und Kalender schon anschauen, bevor Auth und Datenbank aktiv sind.
