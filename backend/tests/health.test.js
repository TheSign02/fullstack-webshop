import request from 'supertest';

const getApp = () => {
  if (!globalThis.__APP__) throw new Error('Test app not initialized');
  return globalThis.__APP__;
};

describe('Healthcheck', () => {
  it('GET /healthcheck returns health: ok', async () => {
    const res = await request(getApp()).get('/healthcheck');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ health: 'ok' });
  });

  it('Unknown route returns 404', async () => {
    const res = await request(getApp()).get('/__does_not_exist__');
    expect(res.statusCode).toBe(404);
  });
});
