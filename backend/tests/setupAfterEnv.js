import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

beforeAll(async () => {
  if (globalThis.__MONGO_SERVER__ && globalThis.__APP__) return;

  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

  const server = await MongoMemoryServer.create();
  process.env.MONGO_URI = server.getUri();

  const mod = await import('../src/app.js');
  globalThis.__APP__ = mod.default;
  globalThis.__MONGO_SERVER__ = server;
});

afterAll(async () => {
  await mongoose.disconnect().catch(() => undefined);

  const server = globalThis.__MONGO_SERVER__;
  if (server) {
    await server.stop().catch(() => undefined);
  }

  globalThis.__APP__ = undefined;
  globalThis.__MONGO_SERVER__ = undefined;
});
