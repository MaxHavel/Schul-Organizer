// Erlaubt Anfragen von VS Code Live Server (anderer Port), inklusive Login-Cookie
const defaultOrigins = 'http://localhost:5500,http://127.0.0.1:5500';
const allowed = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((o) => o.trim());

module.exports = function cors(req, res, next) {
  const { origin } = req.headers;
  if (!origin || !allowed.includes(origin)) return next();

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.sendStatus(204);
  }
  next();
};
