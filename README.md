# Schul-Organizer (SOG)

Web-App zur Schulorganisation: Aufgaben, Gruppen, Kalender und Punkte.
Backend mit Node.js (Express) und PostgreSQL, dazu einfache HTML-Seiten zum Testen der Funktionen.
Der Plan fürs Backend steht in [docs/backend-plan.md](docs/backend-plan.md).

## Voraussetzungen

- [Node.js](https://nodejs.org) 20 oder neuer
- PostgreSQL 16, entweder über [Docker Desktop](https://www.docker.com/products/docker-desktop/) oder direkt installiert

## Starten

```bash
npm install
cp .env.example .env          # Windows: copy .env.example .env
docker compose up -d          # startet Postgres (oder eigene Installation verwenden)
npm run db:seed               # legt Tabellen + Testdaten an (löscht vorhandene Daten!)
npm run dev                   # Server mit Auto-Reload
```

Dann <http://localhost:3000> öffnen. Test-Login: `anna` / `passwort123` (auch `ben`, `cem`).

Ohne Docker: In PostgreSQL einen User `sog` mit Passwort `sog` und eine Datenbank `sog` anlegen, oder `DATABASE_URL` in `.env` anpassen.

## Tests

```bash
npm test
```

Die Tests löschen und erstellen alle Tabellen neu. Wer seine Entwicklungsdaten behalten will, legt eine eigene Testdatenbank an und setzt `TEST_DATABASE_URL` in `.env`.

## Ordnerstruktur

| Ordner | Inhalt |
|---|---|
| `db/` | `schema.sql` (alle Tabellen), `seed.sql` (Testdaten), `init.js` |
| `src/` | Express-App: `app.js`, `db.js`, `middleware/`, `routes/` |
| `public/` | Minimales HTML zum Testen. Hier kann das Frontend-Team verschönern. |
| `tests/` | Integrationstests (Jest + Supertest) |

## API

Alle Endpunkte liefern JSON. Fehler kommen als `{ "error": "Meldung" }`.
Der Login läuft über ein Session-Cookie, `fetch` im Browser schickt es automatisch mit.

| Methode | Pfad | Body | Antwort |
|---|---|---|---|
| POST | `/api/auth/register` | `username, email, password, display_name, klasse?` | `201 { user }`, loggt direkt ein |
| POST | `/api/auth/login` | `login` (Benutzername oder E-Mail), `password` | `200 { user }` |
| POST | `/api/auth/logout` | – | `204` |
| GET | `/api/auth/me` | – | `200 { user }` oder `401` |

Weitere Endpunkte (Aufgaben, Gruppen, Termine, Punkte, Dashboard) folgen laut Plan.
