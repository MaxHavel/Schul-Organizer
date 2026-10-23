-- Testdaten. Alle Test-User haben das Passwort: passwort123
INSERT INTO users (username, email, password_hash, display_name, klasse) VALUES
  ('anna', 'anna@example.com', '__HASH__', 'Anna Beispiel', '3AHWII'),
  ('ben',  'ben@example.com',  '__HASH__', 'Ben Beispiel',  '3AHWII'),
  ('cem',  'cem@example.com',  '__HASH__', 'Cem Beispiel',  '3BHWII');

INSERT INTO groups (name, description, created_by) VALUES
  ('Projektmanagement', 'Gruppe für das SOG-Projekt', 1);

INSERT INTO group_members (group_id, user_id, role) VALUES
  (1, 1, 'owner'), (1, 2, 'member'), (1, 3, 'member');

INSERT INTO tasks (title, description, due_date, important, urgent, created_by, group_id) VALUES
  ('Mathe Hausübung', 'Seite 42, Bsp. 1-5', now() + interval '2 days', true, true, 1, NULL),
  ('Präsentation vorbereiten', 'Folien für die Zwischenabnahme', now() + interval '7 days', true, false, 1, 1);
