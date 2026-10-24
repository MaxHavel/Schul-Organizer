// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Interner Serverfehler' });
};
