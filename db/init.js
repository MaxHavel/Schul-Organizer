// Legt das Schema an (und optional Testdaten): npm run db:init / npm run db:seed
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require('../src/db');

async function init({ seed = false } = {}) {
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  if (seed) {
    const hash = await bcrypt.hash('passwort123', 10);
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8').replaceAll('__HASH__', hash);
    await pool.query(sql);
  }
}

if (require.main === module) {
  const seed = process.argv.includes('--seed');
  init({ seed })
    .then(() => console.log(seed ? 'Schema + Testdaten angelegt.' : 'Schema angelegt.'))
    .catch((err) => { console.error(err); process.exitCode = 1; })
    .finally(() => pool.end());
}

module.exports = { init };
