// Die Tests löschen alle Tabellen. Darum laufen sie nur gegen eine eigene Testdatenbank.
require('dotenv').config();
if (!process.env.TEST_DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL ist nicht gesetzt (siehe .env.example). Die Tests würden sonst deine Daten löschen.');
}
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
