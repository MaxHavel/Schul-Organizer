// Port vom Node-Server. Kommt die Seite von woanders (z. B. Live Server auf 5500),
// gehen die Anfragen direkt an den Node-Server.
const API_PORT = '3000';
const API_BASE = location.port === API_PORT ? '' : `http://${location.hostname || 'localhost'}:${API_PORT}`;

// Kleine Hilfsfunktion für API-Aufrufe. Wirft einen Fehler mit der Meldung vom Server.
async function api(method, url, body) {
  let res;
  try {
    res = await fetch(API_BASE + url, {
      method,
      credentials: 'include', // Login-Cookie auch über Live Server mitschicken
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Server nicht erreichbar. Läuft "npm run dev"?');
  }
  if (res.status === 204) return null;

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unerwartete Antwort (${res.status}). Läuft "npm run dev" auf Port ${API_PORT}?`);
  }
  if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
  return data;
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}
