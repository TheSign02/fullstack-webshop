import request from 'supertest';
import User from '../src/models/User.js';
import { clearDatabase } from './helpers/db.js';
import { login, makeAuthHeader, register } from './helpers/auth.js';

const getApp = () => {
  if (!globalThis.__APP__) throw new Error('Test app not initialized');
  return globalThis.__APP__;
};

describe('Auth + Users', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('registers a user and returns token + user', async () => {
    const res = await register(getApp(), {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  });

  it('rejects register when missing fields', async () => {
    const res = await request(getApp()).post('/api/users/register').send({ email: 'x@y.z' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('logs in an existing user', async () => {
    await register(getApp(), {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    const res = await login(getApp(), { email: 'test@example.com', password: 'Password123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: 'test@example.com',
    });
  });

  it('rejects login with bad password', async () => {
    await register(getApp(), {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    const res = await login(getApp(), { email: 'test@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('GET /api/users/me requires auth', async () => {
    const res = await request(getApp()).get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/users/me returns profile with valid token', async () => {
    const reg = await register(getApp(), {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    const token = reg.body.token;
    const res = await request(getApp())
      .get('/api/users/me')
      .set(makeAuthHeader(token));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('logout requires auth', async () => {
    const res = await request(getApp()).post('/api/auth/logout');
    expect(res.statusCode).toBe(401);
  });

  it('logout succeeds with valid token', async () => {
    const reg = await register(getApp(), {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    const token = reg.body.token;
    const res = await request(getApp())
      .post('/api/auth/logout')
      .set(makeAuthHeader(token));

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Logged out' });
  });

  it('admin-only endpoint rejects non-admin token', async () => {
    const reg = await register(getApp(), {
      name: 'Normal User',
      email: 'user@example.com',
      password: 'Password123!',
    });

    const res = await request(getApp())
      .get('/api/users')
      .set(makeAuthHeader(reg.body.token));

    expect(res.statusCode).toBe(403);
  });

  it('admin-only endpoint works with admin token', async () => {
    await register(getApp(), {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123!',
    });

    await User.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } });

    const adminLogin = await login(getApp(), {
      email: 'admin@example.com',
      password: 'Password123!',
    });

    const res = await request(getApp())
      .get('/api/users')
      .set(makeAuthHeader(adminLogin.body.token));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('Google auth endpoints return 501', async () => {
    const res1 = await request(getApp()).get('/api/auth/google');
    const res2 = await request(getApp()).get('/api/auth/google/callback');

    expect(res1.statusCode).toBe(501);
    expect(res2.statusCode).toBe(501);
  });
});
