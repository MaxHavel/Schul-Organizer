const request = require('supertest');
const { createApp } = require('../src/app');
const { pool } = require('../src/db');
const { init } = require('../db/init');

const app = createApp();
const newUser = {
  username: 'testuser',
  email: 'Test@Example.com',
  password: 'geheim1234',
  display_name: 'Test User',
  klasse: '3AHWII',
};

beforeAll(() => init());
afterAll(() => pool.end());

describe('Auth', () => {
  const agent = request.agent(app);

  test('/me ohne Login liefert 401', async () => {
    await request(app).get('/api/auth/me').expect(401);
  });

  test('Registrieren legt User an und loggt ein', async () => {
    const res = await agent.post('/api/auth/register').send(newUser).expect(201);
    expect(res.body.user).toMatchObject({ username: 'testuser', email: 'test@example.com' });
    expect(res.body.user.password_hash).toBeUndefined();
    await agent.get('/api/auth/me').expect(200);
  });

  test('Doppelter Benutzername liefert 409', async () => {
    await request(app).post('/api/auth/register').send(newUser).expect(409);
  });

  test('Ungültige Eingaben liefern 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'x', email: 'kaputt', password: 'kurz' })
      .expect(400);
    expect(res.body.error).toMatch(/Passwort/);
  });

  test('Logout beendet die Session', async () => {
    await agent.post('/api/auth/logout').expect(204);
    await agent.get('/api/auth/me').expect(401);
  });

  test('Login mit falschem Passwort liefert 401', async () => {
    await request(app).post('/api/auth/login').send({ login: 'testuser', password: 'falsch123' }).expect(401);
  });

  test('Login mit E-Mail funktioniert', async () => {
    const login = request.agent(app);
    const res = await login.post('/api/auth/login').send({ login: 'TEST@example.com', password: 'geheim1234' }).expect(200);
    expect(res.body.user.username).toBe('testuser');
    await login.get('/api/auth/me').expect(200);
  });
});
