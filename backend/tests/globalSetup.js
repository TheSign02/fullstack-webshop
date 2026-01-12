import { MongoMemoryServer } from 'mongodb-memory-server';
import { setMongoServer } from './_mongoState.js';

export default async function globalSetup() {
  const server = await MongoMemoryServer.create();
  setMongoServer(server);

  process.env.NODE_ENV = 'test';
  process.env.MONGO_URI = server.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
}
