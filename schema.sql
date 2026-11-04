PRAGMA foreign_keys = ON;
/*
Create TABLE benutzer (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL UNIQUE,
    passwort_hash TEXT    NOT NULL,
    vorname       TEXT    NOT NULL,
    nachname      TEXT    NOT NULL,
    punkte        INTEGER NOT NULL DEFAULT 0,
    erstellt_am   TEXT    NOT NULL DEFAULT (datetime('now'))
);

Create TABLE gruppen (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    erstellt_von INTEGER NOT NULL REFERENCES benutzer (id) ON DELETE CASCADE,
    erstellt_am TEXT    NOT NULL DEFAULT (datetime('now'))
);

Create TABLE gruppen_mitglieder (
    gruppe_id   INTEGER NOT NULL REFERENCES gruppen (id) ON DELETE CASCADE,
    benutzer_id INTEGER NOT NULL REFERENCES benutzer (id) ON DELETE CASCADE,
    PRIMARY KEY (gruppe_id, benutzer_id)
);
*/
Update TABLE aufgaben (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    benutzer_id  INTEGER NOT NULL REFERENCES benutzer (id) ON DELETE CASCADE,
    gruppe_id    INTEGER          REFERENCES gruppen (id) ON DELETE SET NULL,
    titel        TEXT    NOT NULL,
    beschreibung TEXT,
    faellig_am   TEXT,  Not NULL,
    wichtig      INTEGER NOT NULL DEFAULT 0 CHECK (wichtig IN (0, 1)),
    dringend     INTEGER NOT NULL DEFAULT 0 CHECK (dringend IN (0, 1)),
    status       TEXT    NOT NULL DEFAULT 'offen'
                 CHECK (status IN ('offen', 'in_arbeit', 'erledigt')),
    punkte       INTEGER NOT NULL DEFAULT 0,
    erstellt_am  TEXT    NOT NULL DEFAULT (datetime('now'))
);


/*
Create TABLE termine (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    benutzer_id INTEGER NOT NULL REFERENCES benutzer (id) ON DELETE CASCADE,
    gruppe_id   INTEGER          REFERENCES gruppen (id) ON DELETE SET NULL,
    titel       TEXT    NOT NULL,
    datum       TEXT    NOT NULL,
    beschreibung TEXT
);

CREATE INDEX idx_aufgaben_benutzer ON aufgaben (benutzer_id);
CREATE INDEX idx_aufgaben_gruppe   ON aufgaben (gruppe_id);
CREATE INDEX idx_aufgaben_faellig  ON aufgaben (faellig_am);
CREATE INDEX idx_termine_datum     ON termine (datum);
*/
