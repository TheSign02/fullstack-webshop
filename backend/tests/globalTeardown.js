import { getMongoServer } from './_mongoState.js';

export default async function globalTeardown() {
  const server = getMongoServer();
  if (server) {
    await server.stop();
  }
}
