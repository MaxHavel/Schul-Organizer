// Kleine Hilfsfunktion für API-Aufrufe. Wirft einen Fehler mit der Meldung vom Server.
async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
  return data;
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}
