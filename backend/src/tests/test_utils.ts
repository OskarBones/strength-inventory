import { expect } from 'vitest';
import request from 'supertest';

import app from '../index.js';

import { type LoginResponse } from '@strength-inventory/schemas';

interface loginProps {
  username: string
  password: string
}

export async function login ({ username, password }: loginProps) {
  const response: request.Response = await request(app)
    .post('/api/login')
    .send({
      username: username,
      password: password
    })
    .expect(200);

  const body = response.body as LoginResponse;
  const token: string = body.token;

  expect.assert.isDefined(response.headers['set-cookie']);
  const cookies = response.headers['set-cookie'];

  return { token, cookies };
}
