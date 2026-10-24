// Schützt Routen: nur eingeloggte User kommen durch
module.exports = function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Nicht eingeloggt' });
  }
  next();
};
