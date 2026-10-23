// Testdatenbank: TEST_DATABASE_URL setzen, sonst wird DATABASE_URL verwendet.
// ACHTUNG: Die Tests löschen und erstellen alle Tabellen neu!
require('dotenv').config();
if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
