const request = require('supertest');
const { createApp } = require('../src/app');
const { pool } = require('../src/db');
const { init } = require('../db/init');

const app = createApp();
const liveServer = 'http://127.0.0.1:5500';

beforeAll(() => init({ reset: true }));
afterAll(() => pool.end());

describe('Live Server (CORS)', () => {
  test('Preflight von Live Server wird erlaubt', async () => {
    const res = await request(app)
      .options('/api/auth/login')
      .set('Origin', liveServer)
      .set('Access-Control-Request-Method', 'POST')
      .expect(204);
    expect(res.headers['access-control-allow-origin']).toBe(liveServer);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  test('Fremde Seiten bekommen keine CORS-Header', async () => {
    const res = await request(app).get('/api/auth/me').set('Origin', 'http://evil.example').expect(401);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('Login über Live Server: Cookie funktioniert bei /me', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').set('Origin', liveServer)
      .send({ username: 'liveuser', email: 'live@example.com', password: 'geheim1234' })
      .expect(201)
      .expect('Access-Control-Allow-Origin', liveServer);
    await agent.get('/api/auth/me').set('Origin', liveServer).expect(200);
  });
});
