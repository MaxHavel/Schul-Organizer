require('dotenv').config();
const { createApp } = require('./app');
const { init } = require('../db/init');

const port = process.env.PORT || 3000;

// Fehlende Tabellen anlegen, bestehende Daten bleiben erhalten
init()
  .then(() => {
    createApp().listen(port, () => {
      console.log(`Schul-Organizer läuft auf http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Datenbank nicht erreichbar. Läuft Postgres und stimmt DATABASE_URL in .env?');
    console.error(err.message);
    process.exit(1);
  });
