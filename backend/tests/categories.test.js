import request from 'supertest';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import { clearDatabase } from './helpers/db.js';
import { login, makeAuthHeader, register } from './helpers/auth.js';

const getApp = () => {
  if (!globalThis.__APP__) throw new Error('Test app not initialized');
  return globalThis.__APP__;
};

describe('Categories API', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    await clearDatabase();

    const regUser = await register(getApp(), {
      name: 'User',
      email: 'user@example.com',
      password: 'Password123!',
    });
    userToken = regUser.body.token;

    await register(getApp(), {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Password123!',
    });
    await User.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } });
    const adminLogin = await login(getApp(), {
      email: 'admin@example.com',
      password: 'Password123!',
    });
    adminToken = adminLogin.body.token;
  });

  it('GET /api/categories lists categories', async () => {
    await Category.create({ name: 'Electronics', description: 'Tech stuff' });

    const res = await request(getApp()).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories[0]).toHaveProperty('name');
  });

  it('POST /api/categories requires auth', async () => {
    const res = await request(getApp()).post('/api/categories').send({ name: 'New' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/categories forbids non-admin', async () => {
    const res = await request(getApp())
      .post('/api/categories')
      .set(makeAuthHeader(userToken))
      .send({ name: 'New' });

    expect(res.statusCode).toBe(403);
  });

  it('POST /api/categories creates category for admin', async () => {
    const res = await request(getApp())
      .post('/api/categories')
      .set(makeAuthHeader(adminToken))
      .send({ name: 'New Category', description: 'Desc' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'New Category');
  });

  it('PUT /api/categories/:id updates category for admin', async () => {
    const cat = await Category.create({ name: 'Old', description: 'Old desc' });

    const res = await request(getApp())
      .put(`/api/categories/${cat._id}`)
      .set(makeAuthHeader(adminToken))
      .send({ name: 'Updated', description: 'New desc' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated');
    expect(res.body).toHaveProperty('description', 'New desc');
  });

  it('DELETE /api/categories/:id deletes category for admin', async () => {
    const cat = await Category.create({ name: 'ToDelete', description: '' });

    const res = await request(getApp())
      .delete(`/api/categories/${cat._id}`)
      .set(makeAuthHeader(adminToken));

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
