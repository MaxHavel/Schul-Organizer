// Datenbank vorbereiten.
//   npm run db:init   legt fehlende Tabellen an (passiert auch automatisch beim Serverstart)
//   npm run db:reset  LÖSCHT ALLE DATEN und legt Tabellen + Testdaten neu an
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require('../src/db');

const DROP_ALL = 'DROP TABLE IF EXISTS points_log, events, tasks, group_members, groups, users, session CASCADE';

async function init({ reset = false, seed = false } = {}) {
  if (reset) await pool.query(DROP_ALL);
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  if (seed) {
    const hash = await bcrypt.hash('passwort123', 10);
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8').replaceAll('__HASH__', hash);
    await pool.query(sql);
  }
}

if (require.main === module) {
  const reset = process.argv.includes('--reset');
  init({ reset, seed: reset })
    .then(() => console.log(reset ? 'Datenbank zurückgesetzt, Testdaten angelegt.' : 'Tabellen sind bereit.'))
    .catch((err) => { console.error(err); process.exitCode = 1; })
    .finally(() => pool.end());
}

module.exports = { init };
