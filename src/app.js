const path = require('path');
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { pool } = require('./db');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(session({
    store: new PgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 },
  }));

  app.use('/api/auth', authRoutes);
  app.use('/api', (req, res) => res.status(404).json({ error: 'Endpunkt nicht gefunden' }));

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('/', (req, res) => res.redirect('/login.html'));

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
