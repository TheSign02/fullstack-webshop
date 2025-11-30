import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

describe('Healthcheck endpoint', () => {
  it('should return health: ok', async () => {
    const res = await request(app).get('/healthcheck');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('health', 'ok');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});