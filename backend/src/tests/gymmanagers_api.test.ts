import { afterAll, assert, beforeEach, describe, expect, test } from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import app from '../index.ts';
import { login } from './test_utils.ts';

import { Gym, GymManagers, User } from '../models/index.ts';

import {
  type GymManager as FullGymManager,
  type LoginResponse
} from '@strength-inventory/schemas';

let token: string;
let cookies: string;

const adminId = '54419ee4-2880-4e96-82d7-69dfc1238584';  // User
const goldId = 'cabd5a6b-8cf7-41be-8333-0d76487681a1';  // User
const lashaId = '8f94f7e9-470e-4c78-bed9-5f30bd59730c';  // User

const mayorId = '6f18417c-78f7-440e-a342-a7e26a3916b6';  // Gym
const elixiaId = '742774c2-68fa-450c-8678-93289c3f37a8';  // Gym

const goldMayorId = '14bbb73c-a847-4644-8bf1-c9f5ee368483';  // GymManager

beforeEach(async () => {
  await User.truncate({ cascade: true });
  await Gym.truncate({ cascade: true });

  let passwordHash: string;
  const salt = genSaltSync(10);

  passwordHash = hashSync('ThereIsOnlyWeightAndThoseTooWeakToLiftIt', salt);
  await User.create({
    id: adminId,
    username: 'TheAdmin',
    email: 'admin@strengthinventory.eu',
    emailVerified: true,
    passwordHash,
    name: 'The Admin',
    role: 'ADMIN'
  });

  passwordHash = hashSync('HustleForThatMuscle', salt);
  await User.create({
    id: goldId,
    username: 'PureGold',
    email: 'joe@gold.us',
    emailVerified: true,
    passwordHash,
    name: 'Joe Gold',
    role: 'MANAGER'
  });

  passwordHash = hashSync('ILiftThereforeIAm', salt);
  await User.create({
    id: lashaId,
    username: 'LashaTalakhadze',
    email: 'lasha@talakhadze.ge',
    emailVerified: true,
    passwordHash,
    name: 'Lasha Talakhadze',
    role: 'GYM-GOER'
  });

  await Gym.create({
    id: mayorId,
    name: 'Mayor\'s gym',
    street: 'Porkkalankatu',
    streetNumber: '13N',
    district: 'Ruoholahti',
    city: 'Helsinki',
    country: 'FIN',
    latitude: 60.16305,
    longitude: 24.90255,
    // eslint-disable-next-line @stylistic/max-len
    location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
  });

  await Gym.create({
    id: elixiaId,
    name: 'ELIXIA Kamppi',
    chain: 'ELIXIA',
    street: 'Fredrikinkatu',
    streetNumber: '48',
    district: 'Kamppi',
    city: 'Helsinki',
    country: 'FIN',
    latitude: 60.16933,
    longitude: 24.92966,
    // eslint-disable-next-line @stylistic/max-len
    location: 'https://www.google.com/maps/place/ELIXIA+Kamppi/@60.1694856,24.9268664,17z/data=!3m1!4b1!4m6!3m5!1s0x46920a3485cc265d:0xace8b112832c5729!8m2!3d60.169483!4d24.929436!16s%2Fg%2F1q67ml5y5?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
  });

  await GymManagers.create({
    id: goldMayorId,
    userId: goldId,
    gymId: mayorId
  });

  ({ token, cookies } = await login({
    username: 'TheAdmin',
    password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt'
  }));
});

afterAll(async () => {
  await User.truncate({ cascade: true });
  await Gym.truncate({ cascade: true });
});

test(
  `Giving gym-goer their first manager rights
  succeeds and changes their role to "MANAGER"`,
  async () => {
    await request(app)
      .post('/api/gymmanagers')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ userId: lashaId, gymId: mayorId })
      .expect(201);

    const lasha = await User.findByPk(lashaId);
    assert.isNotNull(lasha);
    expect(lasha.role).toBe('MANAGER');
  }
);

describe('Removing manager rights from a user', () => {
  test(
    'changes their role to "GYM-GOER" if they have no remaining manager rights',
    async () => {
      await request(app)
        .delete(`/api/gymmanagers/${goldMayorId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(204);

      const gold = await User.findByPk(goldId);
      assert.isNotNull(gold);
      expect(gold.role).toBe('GYM-GOER');
    }
  );

  test(
    'does not affect their role if they have other manager rights',
    async () => {
      await request(app)
        .post('/api/gymmanagers')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send({ userId: goldId, gymId: elixiaId })
        .expect(201);

      await request(app)
        .delete(`/api/gymmanagers/${goldMayorId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(204);

      const gold = await User.findByPk(goldId);
      assert.isNotNull(gold);
      expect(gold.role).toBe('MANAGER');
    }
  );
});

describe('Being an admin', () => {
  test(
    'means that your role is not affected by changes in manager rights',
    async () => {
      let admin: User | null;

      const response: request.Response = await request(app)
        .post('/api/gymmanagers')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send({ userId: adminId, gymId: mayorId })
        .expect(201);

      admin = await User.findByPk(adminId);
      assert.isNotNull(admin);
      expect(admin.role).toBe('ADMIN');

      const body = response.body as FullGymManager;
      const adminMayor = body.id;

      await request(app)
        .delete(`/api/gymmanagers/${adminMayor}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(204);

      admin = await User.findByPk(adminId);
      assert.isNotNull(admin);
      expect(admin.role).toBe('ADMIN');
    }
  );

  test('is required to POST or DELETE manager rights', async () => {
    const response: request.Response = await request(app)
      .post('/api/login')
      .send({ username: 'LashaTalakhadze', password: 'ILiftThereforeIAm' })
      .expect(200);

    const body = response.body as LoginResponse;
    token = body.token;

    if (response.headers['set-cookie']) {
      cookies = response.headers['set-cookie'];
    }

    await request(app)
      .post('/api/gymmanagers')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ userId: lashaId, gymId: mayorId })
      .expect(403);

    await request(app)
      .delete(`/api/gymmanagers/${goldMayorId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .expect(403);
  });
});

test(
  'When a gym is deleted, a gymless "MANAGER" becomes a "GYM-GOER"',
  async () => {
    await request(app)
      .post('/api/gymmanagers')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ userId: goldId, gymId: elixiaId })
      .expect(201);

    await request(app)
      .post('/api/gymmanagers')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ userId: lashaId, gymId: mayorId })
      .expect(201);

    await request(app)
      .delete(`/api/gyms/${mayorId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .expect(204);

    const gold = await User.findByPk(goldId);
    assert.isNotNull(gold);
    expect(gold.role).toBe('MANAGER');

    const lasha = await User.findByPk(lashaId);
    assert.isNotNull(lasha);
    expect(lasha.role).toBe('GYM-GOER');
  }
);
