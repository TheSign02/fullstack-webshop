import request from 'supertest';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import { clearDatabase } from './helpers/db.js';
import { login, makeAuthHeader, register } from './helpers/auth.js';

const getApp = () => {
  if (!globalThis.__APP__) throw new Error('Test app not initialized');
  return globalThis.__APP__;
};

describe('Products API', () => {
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

  it('GET /api/products returns paginated response', async () => {
    await Product.create({
      title: 'Test Product',
      description: 'Desc',
      price: 9.99,
      category: 'Electronics',
      imageUrl: 'NONE',
      stock: 5,
      isFeatured: false,
    });

    const res = await request(getApp()).get('/api/products?page=1&limit=12');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('POST /api/products requires auth', async () => {
    const res = await request(getApp()).post('/api/products').send({ title: 'X', price: 1 });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/products forbids non-admin', async () => {
    const res = await request(getApp())
      .post('/api/products')
      .set(makeAuthHeader(userToken))
      .send({ title: 'X', price: 1 });

    expect(res.statusCode).toBe(403);
  });

  it('POST /api/products validates required fields', async () => {
    const res = await request(getApp())
      .post('/api/products')
      .set(makeAuthHeader(adminToken))
      .send({ description: 'Missing title and price' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Admin can create, get, update, and delete a product', async () => {
    const createRes = await request(getApp())
      .post('/api/products')
      .set(makeAuthHeader(adminToken))
      .send({
        title: 'Premium Coffee Mug',
        description: 'Ceramic mug, 350ml',
        price: 12.5,
        category: 'Home & Kitchen',
        imageUrl: 'NONE',
        stock: 42,
        isFeatured: true,
      });

    expect(createRes.statusCode).toBe(201);
    const id = createRes.body._id;

    const getRes = await request(getApp()).get(`/api/products/${id}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('title', 'Premium Coffee Mug');

    const updateRes = await request(getApp())
      .put(`/api/products/${id}`)
      .set(makeAuthHeader(adminToken))
      .send({ price: 13.0, stock: 40 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('price', 13.0);
    expect(updateRes.body).toHaveProperty('stock', 40);

    const delRes = await request(getApp())
      .delete(`/api/products/${id}`)
      .set(makeAuthHeader(adminToken));

    expect(delRes.statusCode).toBe(200);
    expect(delRes.body).toEqual({ ok: true });
  });

  it('GET /api/products/search filters by q and category', async () => {
    await Product.create([
      { title: 'Red T-Shirt', price: 9.99, category: 'Fashion', imageUrl: 'NONE', stock: 10 },
      { title: 'Blue T-Shirt', price: 9.99, category: 'Fashion', imageUrl: 'NONE', stock: 10 },
      { title: 'Kitchen Knife', price: 19.99, category: 'Home & Kitchen', imageUrl: 'NONE', stock: 5 },
    ]);

    const res1 = await request(getApp()).get('/api/products/search?q=t-shirt');
    expect(res1.statusCode).toBe(200);
    expect(res1.body.items.length).toBe(2);

    const res2 = await request(getApp()).get('/api/products/search?category=Home%20%26%20Kitchen');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.items.length).toBe(1);
  });
});
