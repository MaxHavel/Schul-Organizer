const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

const PUBLIC_FIELDS = 'id, username, email, klasse, role, theme_color, created_at';

function validateRegister(body) {
  const errors = [];
  const { username, email, password } = body || {};
  if (!username || !/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
    errors.push('Benutzername: 3-30 Zeichen (Buchstaben, Zahlen, _ . -)');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Ungültige E-Mail-Adresse');
  if (!password || password.length < 8) errors.push('Passwort muss mindestens 8 Zeichen haben');
  return errors;
}

// Session-ID neu vergeben, damit eine alte Session nicht übernommen werden kann
function startSession(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.userId = userId;
      resolve();
    });
  });
}

router.post('/register', async (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(', ') });

    const { username, email, password, klasse } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (username, email, password_hash, klasse)
       VALUES ($1, lower($2), $3, $4)
       RETURNING ${PUBLIC_FIELDS}`,
      [username, email, passwordHash, klasse || null],
    );
    await startSession(req, rows[0].id);
    res.status(201).json({ user: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Benutzername oder E-Mail ist schon vergeben' });
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Benutzername und Passwort angeben' });

    const { rows } = await db.query(
      `SELECT ${PUBLIC_FIELDS}, password_hash FROM users WHERE lower(username) = lower($1)`,
      [username],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Benutzername oder Passwort falsch' });
    }
    delete user.password_hash;
    await startSession(req, user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
});

router.get('/me', requireLogin, async (req, res, next) => {
  try {
    const { rows } = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [req.session.userId]);
    if (!rows[0]) return res.status(401).json({ error: 'Nicht eingeloggt' });
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
