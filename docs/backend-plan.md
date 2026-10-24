# Schul-Organizer: Backend-Plan (Entwurf)

## Was ich aus dem Projektantrag verstanden habe

**Stack (laut Antrag):** HTML, CSS, JavaScript mit Node.js, Datenbank PostgreSQL (Tabellen für User, Gruppen, Aufgaben, Termine, Punkte).

**Muss-Ziele**
- Login für alle User, Benutzer mit Rollen
- Aufgabenverwaltung: anlegen, bearbeiten, löschen, Fälligkeitsdatum, Einstufung nach Wichtigkeit und Dringlichkeit, Status offen / in Arbeit / erledigt
- Dashboard: Übersicht über eigene und Gruppenaufgaben (inkl. Daten für Charts)
- Kalender + To-do-Liste: Termine und To-dos verknüpft und im Kalender sichtbar
- Gruppen: klassenübergreifend, Mitschüler auswählen, Aufgaben für die Gruppe eintragen
- Punktesystem: Punkte für erledigte Aufgaben, Anzeige am Dashboard
- Responsive (betrifft vor allem das Frontend)

**Kann-Ziele:** Chat pro Gruppe/Aufgabe, Personalisierung (Farbe/Design pro User), Umwandlung in eine Handy-App.

**Nichtziele:** keine Haupt-Kommunikationsplattform, keine Schulverwaltung (Lehrkräfte), Punktesystem soll nicht spielähnlich werden.

**Zeitplan:** Backend + DB Dez 2026 bis März 2027, Ziele implementiert bis 01.03.2027, Bugfixes bis 01.05.2027, Abnahme 02.06.2027.

## Vorgeschlagener Stack im Detail

| Bereich | Wahl | Warum |
|---|---|---|
| Server | Node.js + Express | Standard, viele Tutorials, leicht für das ganze Team |
| DB-Zugriff | `pg` (node-postgres) mit reinem SQL | Kein ORM-Overhead, SQL lernt man nebenbei, passt zum Unterricht |
| Login | `express-session` + `connect-pg-simple` + `bcrypt` | Session-Cookie ist einfacher und sicherer als selbstgebautes JWT |
| Validierung | `zod` (oder einfache eigene Checks) | Saubere Fehlermeldungen für das Frontend |
| Tests | Jest + Supertest | Integrationstests, wie im Antrag bei den Risiken versprochen |
| Lokale DB | Docker Compose mit Postgres | Alle im Team haben dieselbe DB-Version |

Das Backend liefert eine **JSON-API** unter `/api/...` und dient zusätzlich die HTML-Seiten aus `public/` aus. Eure Frontend-Kollegen können die Testseiten dann einfach verschönern oder ersetzen, solange sie dieselbe API aufrufen.

## Ordnerstruktur

```
schulorganizer/
├── docker-compose.yml        # Postgres lokal
├── package.json
├── .env.example              # DB-URL, Session-Secret
├── db/
│   ├── schema.sql            # alle Tabellen
│   └── seed.sql              # Testdaten (ein paar User, Gruppen, Aufgaben)
├── src/
│   ├── server.js             # startet den Server
│   ├── app.js                # Express-Setup, Middleware, Routen
│   ├── db.js                 # Postgres-Pool
│   ├── middleware/
│   │   ├── requireLogin.js
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── tasks.js
│       ├── groups.js
│       ├── events.js
│       ├── points.js
│       └── dashboard.js
├── public/                   # minimales HTML zum Testen
│   ├── login.html  register.html
│   ├── dashboard.html  tasks.html  groups.html  calendar.html
│   └── js/api.js             # kleine fetch-Hilfsfunktion
└── tests/
    └── *.test.js
```

## Datenbank-Schema (Entwurf)

- **users**: id, username (= Anzeigename, Groß/Klein egal eindeutig), email, password_hash, klasse, role (`student` / `admin`), theme_color, created_at
- **groups**: id, name, description, created_by, created_at
- **group_members**: group_id, user_id, role (`owner` / `member`), joined_at
- **tasks**: id, title, description, due_date, important (bool), urgent (bool), status (`open` / `in_progress` / `done`), created_by, assigned_to (nullable), group_id (nullable = persönliche Aufgabe), completed_at, created_at
- **events** (Termine): id, title, description, starts_at, ends_at, user_id, group_id (nullable), task_id (nullable = Verknüpfung To-do ↔ Termin)
- **points_log**: id, user_id, task_id, points, created_at (Punktestand = Summe; verhindert doppelte Punkte für dieselbe Aufgabe)
- Optional später: **messages** (id, group_id, user_id, content, created_at)

Wichtigkeit/Dringlichkeit als zwei Booleans ergibt automatisch die 4 Eisenhower-Felder, die das Dashboard gut darstellen kann.

## API-Endpunkte (Entwurf)

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **User:** `GET /api/users?search=` (Mitschüler suchen), `PATCH /api/users/me` (Name, Farbe)
- **Aufgaben:** `GET /api/tasks?status=&group=&due_before=`, `POST /api/tasks`, `GET/PATCH/DELETE /api/tasks/:id`, `PATCH /api/tasks/:id/status`
- **Gruppen:** `GET/POST /api/groups`, `GET/PATCH/DELETE /api/groups/:id`, `POST /api/groups/:id/members`, `DELETE /api/groups/:id/members/:userId`, `GET /api/groups/:id/tasks`
- **Termine:** `GET /api/events?from=&to=` (liefert Termine **und** fällige Aufgaben für den Kalender), `POST /api/events`, `PATCH/DELETE /api/events/:id`
- **Punkte:** `GET /api/points/me`, `GET /api/points/history`
- **Dashboard:** `GET /api/dashboard` (Zähler pro Status, Eisenhower-Verteilung, nächste Fälligkeiten, Punktestand)

Berechtigungen: Persönliche Aufgaben sieht nur der Ersteller; Gruppenaufgaben sehen alle Gruppenmitglieder; Gruppen bearbeiten/löschen darf nur der Owner.

## Umsetzungsphasen

1. **Grundgerüst:** Repo, Express, Postgres per Docker, Schema, Seed-Daten, erster Test
2. **Login:** Registrieren, Login/Logout, Session, `requireLogin` + Testseiten
3. **Aufgaben:** CRUD, Status, Wichtigkeit/Dringlichkeit, Filter + `tasks.html`
4. **Gruppen:** Gruppen anlegen, Mitglieder suchen/hinzufügen, Gruppenaufgaben + `groups.html`
5. **Kalender:** Termine, Verknüpfung mit Aufgaben, Zeitraum-Abfrage + `calendar.html`
6. **Punkte + Dashboard:** Punkte beim Erledigen, Statistik-Endpunkt + `dashboard.html`
7. **E-Mail-Bestätigung** (siehe unten)
8. **Optional:** Chat, Personalisierung

## Geplant: E-Mail-Bestätigung bei der Registrierung

**Ablauf**
1. Registrieren legt das Konto mit `email_verified = false` an und schickt eine Mail mit einem Link `http://<server>/verify.html?token=...`.
2. Der Link ruft `POST /api/auth/verify` mit dem Token auf. Ist der Token gültig und nicht abgelaufen, wird `email_verified = true` gesetzt und der Token gelöscht.
3. Login ist erst nach der Bestätigung möglich. Bis dahin antwortet `/api/auth/login` mit `403` und der Meldung „Bitte zuerst die E-Mail bestätigen“.
4. `POST /api/auth/resend-verification` schickt eine neue Mail (höchstens einmal pro Minute).

**Datenbank**
- `users`: neue Spalte `email_verified BOOLEAN NOT NULL DEFAULT false`
- neue Tabelle `email_tokens`: user_id, token_hash, expires_at (24 h). Gespeichert wird nur ein Hash des Tokens, damit ein Datenbank-Leak keine gültigen Links verrät.

**Mailversand**
- Paket `nodemailer`, SMTP-Zugang über `.env` (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`).
- Zum Entwickeln: ohne SMTP-Daten wird der Link nur in der Server-Konsole ausgegeben, oder ihr nehmt ein Test-Postfach wie Mailtrap/Ethereal.
- Für den echten Betrieb braucht ihr einen Mail-Account (z. B. ein eigenes Gmail-Konto mit App-Passwort oder den Mailserver der Schule, falls erlaubt).

**Offen**
- Sollen bestehende Test-Konten automatisch als bestätigt gelten?
- Nur Schul-Adressen (`@spengergasse.at`) zulassen?

## Offene Fragen

- Wie viele Punkte gibt es pro Aufgabe (fix, oder abhängig von Wichtigkeit/Pünktlichkeit)? Wer bekommt bei Gruppenaufgaben die Punkte?
- Gibt es außer Schüler:innen noch eine Admin-Rolle (z. B. für Klassensprecher)?
- Wie teilt ihr drei Backend-Leute die Phasen auf?
