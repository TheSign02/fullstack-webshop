let mongoServer = null;

export const setMongoServer = (server) => {
  mongoServer = server;
};

export const getMongoServer = () => mongoServer;
