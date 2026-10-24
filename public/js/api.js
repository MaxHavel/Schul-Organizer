// Kleine Hilfsfunktion für API-Aufrufe. Wirft einen Fehler mit der Meldung vom Server.
async function api(method, url, body) {
  let res;
  try {
    res = await fetch(url, {
      method,
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
    // Kein JSON: die Seite wurde wahrscheinlich nicht über den Node-Server geöffnet (z. B. Live Server)
    throw new Error(`Unerwartete Antwort (${res.status}). Seite über http://localhost:3000 öffnen, nicht über Live Server.`);
  }
  if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
  return data;
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}
