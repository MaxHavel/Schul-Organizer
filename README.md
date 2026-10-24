<<<<<<< Updated upstream
# Schul-Organizer
=======
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
npm run dev                   # Server mit Auto-Reload, legt fehlende Tabellen automatisch an
```

Dann <http://localhost:3000> öffnen und ein Konto registrieren. Konten bleiben gespeichert, auch nach einem Neustart.

**Wichtig:** Die Seiten immer über `http://localhost:3000` öffnen, nicht über VS Code Live Server oder per Doppelklick auf die HTML-Datei. Sonst gibt es keine API und Registrieren/Login schlagen fehl.

Testdaten: `npm run db:reset` **löscht alle Daten** und legt die Test-User `anna`, `ben`, `cem` an (Passwort jeweils `passwort123`).

Ohne Docker: In PostgreSQL einen User `sog` mit Passwort `sog` und die Datenbanken `sog` und `sog_test` anlegen, oder die URLs in `.env` anpassen.

## Tests

```bash
npm test
```

Die Tests laufen gegen die eigene Datenbank aus `TEST_DATABASE_URL` (Standard: `sog_test`) und leeren sie bei jedem Lauf. Deine echten Daten in `sog` bleiben unberührt. Docker legt `sog_test` beim ersten Start automatisch an; ohne Docker musst du sie selbst anlegen.

## Ordnerstruktur

| Ordner | Inhalt |
|---|---|
| `db/` | `schema.sql` (alle Tabellen), `seed.sql` (Testdaten), `init.js`, `docker/` (legt `sog_test` an) |
| `src/` | Express-App: `app.js`, `db.js`, `middleware/`, `routes/` |
| `public/` | Minimales HTML zum Testen. Hier kann das Frontend-Team verschönern. |
| `tests/` | Integrationstests (Jest + Supertest) |

## API

Alle Endpunkte liefern JSON. Fehler kommen als `{ "error": "Meldung" }`.
Der Benutzername ist gleichzeitig der Anzeigename und eindeutig (Groß/Klein egal). Der Login läuft über ein Session-Cookie, `fetch` im Browser schickt es automatisch mit.

| Methode | Pfad | Body | Antwort |
|---|---|---|---|
| POST | `/api/auth/register` | `username, email, password, klasse?` | `201 { user }`, loggt direkt ein |
| POST | `/api/auth/login` | `username, password` | `200 { user }` |
| POST | `/api/auth/logout` | – | `204` |
| GET | `/api/auth/me` | – | `200 { user }` oder `401` |

Weitere Endpunkte (Aufgaben, Gruppen, Termine, Punkte, Dashboard) folgen laut Plan.
>>>>>>> Stashed changes
