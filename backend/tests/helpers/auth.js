import request from 'supertest';

export const register = async (app, { name, email, password }) => {
  return request(app).post('/api/users/register').send({ name, email, password });
};

export const login = async (app, { email, password }) => {
  return request(app).post('/api/auth/login').send({ email, password });
};

export const makeAuthHeader = (token) => ({ Authorization: `Bearer ${token}` });
