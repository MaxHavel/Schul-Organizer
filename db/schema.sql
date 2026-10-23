-- Schul-Organizer Datenbankschema
-- Achtung: löscht alle bestehenden Tabellen!

DROP TABLE IF EXISTS points_log, events, tasks, group_members, groups, users, session CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  display_name  VARCHAR(100) NOT NULL,
  klasse        VARCHAR(20),
  role          VARCHAR(20)  NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  theme_color   VARCHAR(7),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE groups (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE group_members (
  group_id  INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE tasks (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  due_date     TIMESTAMPTZ,
  important    BOOLEAN NOT NULL DEFAULT false,
  urgent       BOOLEAN NOT NULL DEFAULT false,
  status       VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
  created_by   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  group_id     INTEGER REFERENCES groups(id) ON DELETE CASCADE, -- NULL = persönliche Aufgabe
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE events (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id    INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  task_id     INTEGER REFERENCES tasks(id) ON DELETE SET NULL, -- Verknüpfung Termin <-> To-do
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

CREATE TABLE points_log (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id    INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
  points     INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id) -- pro Aufgabe nur einmal Punkte
);

-- Session-Tabelle für connect-pg-simple
CREATE TABLE session (
  sid    VARCHAR NOT NULL PRIMARY KEY,
  sess   JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX idx_session_expire ON session (expire);

CREATE INDEX idx_tasks_created_by ON tasks (created_by);
CREATE INDEX idx_tasks_group ON tasks (group_id);
CREATE INDEX idx_events_user_start ON events (user_id, starts_at);
