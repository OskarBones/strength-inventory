import { assert, beforeEach, describe, expect, test } from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import app from '../index.ts';
import { login } from './test_utils.ts';

import { User } from '../models/index.ts';

import { type User as FullUser } from '@strength-inventory/schemas';

// the number of users created in the topmost beforeEach
const initialUserCount = 3;
let token: string;
let cookies: string;

beforeEach(async () => {
  await User.truncate({ cascade: true });

  let passwordHash: string;
  const salt = genSaltSync(10);

  passwordHash = hashSync('ThereIsOnlyWeightAndThoseTooWeakToLiftIt', salt);
  await User.create({
    username: 'TheAdmin',
    email: 'admin@strengthinventory.eu',
    emailVerified: true,
    passwordHash,
    name: 'The Admin',
    role: 'ADMIN'
  });

  passwordHash = hashSync('ILiftThereforeIAm', salt);
  await User.create({
    username: 'LashaTalakhadze',
    email: 'lasha@talakhadze.ge',
    emailVerified: true,
    passwordHash,
    name: 'Lasha Talakhadze'
  });

  passwordHash = hashSync('FirstHeavyLiftIsGettingOffTheCouch', salt);
  await User.create({
    username: 'WenwenLi',
    email: 'wenwen@li.ch',
    passwordHash,
    name: 'Wenwen Li'
  });
});

test('GET all users correctly returns a json', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialUserCount);
});

describe('POST a new user', () => {
  test('succeeds if all fields are valid', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);
  });

  test('fails if "username" is null', async () => {
    const newUser = {
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "username" is longer than 30 characters', async () => {
    const newUser = {
      username: 'HeatherConnorrrrrrrrrrrrrrrrrrrrr',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "email" is null', async () => {
    const newUser = {
      username: 'HeatherConnor',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "password" is null', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "password" is shorter than 15 characters', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBody',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "name" is null', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "name" is longer than 100 characters', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      // eslint-disable-next-line @stylistic/max-len
      name: 'Heatheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });
});

describe('PATCH username and name', () => {
  beforeEach(async () => {
    ({ token, cookies } = await login({
      username: 'LashaTalakhadze',
      password: 'ILiftThereforeIAm'
    }));
  });

  test('succeeds on yourself with valid input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ username: 'TheLasha', name: 'Lasha' })
      .expect(200);
  });

  test('fails on yourself with missing username', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ name: 'Lasha' })
      .expect(400);
  });

  test('fails on yourself with missing name', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ username: 'TheLasha' })
      .expect(400);
  });

  test('fails on other users with valid input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'WenwenLi' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ username: 'TheWenwen', name: 'Wenwen' })
      .expect(403);
  });
});

describe('PATCH email', () => {
  beforeEach(async () => {
    ({ token, cookies } = await login({
      username: 'LashaTalakhadze',
      password: 'ILiftThereforeIAm'
    }));
  });

  test('succeeds on yourself with valid input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}/email`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ email: 'lasha@talakhadze.com' })
      .expect(200);
  });

  test('fails on yourself with a non-email input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}/email`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ email: 'LashaIsTheBest' })
      .expect(400);
  });

  test('fails on other users with valid input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'WenwenLi' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}/email`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ email: 'wenwen@li.com' })
      .expect(403);
  });
});

describe('PATCH password', () => {
  beforeEach(async () => {
    ({ token, cookies } = await login({
      username: 'LashaTalakhadze',
      password: 'ILiftThereforeIAm'
    }));
  });

  test('succeeds on yourself with valid input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ password: 'StrongTodayStrongerTomorrow' })
      .expect(200);
  });

  test('fails on yourself if shorter than 15 characters', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'LashaTalakhadze' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ password: 'StrongToday' })
      .expect(400);
  });

  test('fails on other users with correct input', async () => {
    const userToPatch: FullUser | null = await User.findOne({
      where: { username: 'WenwenLi' }
    });
    assert.isNotNull(userToPatch);

    await request(app)
      .patch(`/api/users/${userToPatch.id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send({ password: 'StrongTodayStrongerTomorrow' })
      .expect(403);
  });
});

describe('PATCH user\'s role', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      ({ token, cookies } = await login({
        username: 'TheAdmin',
        password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt'
      }));
    });

    test('succeeds with a valid role', async () => {
      const userToPatch: FullUser | null = await User.findOne({
        where: { username: 'LashaTalakhadze' }
      });
      assert.isNotNull(userToPatch);

      await request(app)
        .patch(`/api/users/${userToPatch.id}/role`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send({ role: 'MANAGER' })
        .expect(200);
    });

    test('fails with an invalid role', async () => {
      const userToPatch: FullUser | null = await User.findOne({
        where: { username: 'LashaTalakhadze' }
      });
      assert.isNotNull(userToPatch);

      await request(app)
        .patch(`/api/users/${userToPatch.id}/role`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send({ role: 'GYM-OWNER' })
        .expect(400);
    });
  });

  describe('as a gym-goer', () => {
    beforeEach(async () => {
      ({ token, cookies } = await login({
        username: 'LashaTalakhadze',
        password: 'ILiftThereforeIAm'
      }));
    });

    test('fails on yourself with a valid role', async () => {
      const userToPatch: FullUser | null = await User.findOne({
        where: { username: 'LashaTalakhadze' }
      });
      assert.isNotNull(userToPatch);

      await request(app)
        .patch(`/api/users/${userToPatch.id}/role`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send({ role: 'SUPERUSER' })
        .expect(403);
    });
  });
});

describe('DELETE a user', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      ({ token, cookies } = await login({
        username: 'TheAdmin',
        password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt'
      }));
    });

    test('succeeds with a valid id', async () => {
      const startResponse = await request(app)
        .get('/api/users');

      expect(startResponse.body).toHaveLength(initialUserCount);

      const userToDelete: FullUser | null = await User.findOne({
        where: { username: 'LashaTalakhadze' }
      });
      assert.isNotNull(userToDelete);

      await request(app)
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(204);

      const endResponse = await request(app)
        .get('/api/users');

      expect(endResponse.body).toHaveLength(initialUserCount - 1);
    });

    test('fails with an invalid id', async () => {
      await request(app)
        .delete('/api/users/ca16ce67-718e-497a-acbe-011fcdee4745')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(404);
    });
  });

  describe('as a gym-goer', () => {
    beforeEach(async () => {
      ({ token, cookies } = await login({
        username: 'LashaTalakhadze',
        password: 'ILiftThereforeIAm'
      }));
    });

    test('succeeds on yourself', async () => {
      const startResponse = await request(app)
        .get('/api/users');

      expect(startResponse.body).toHaveLength(initialUserCount);

      const userToDelete: FullUser | null = await User.findOne({
        where: { username: 'LashaTalakhadze' }
      });
      assert.isNotNull(userToDelete);

      await request(app)
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(204);

      const endResponse = await request(app)
        .get('/api/users');

      expect(endResponse.body).toHaveLength(initialUserCount - 1);
    });

    test('fails on other users', async () => {
      const userToDelete: FullUser | null = await User.findOne({
        where: { username: 'WenwenLi' }
      });
      assert.isNotNull(userToDelete);

      await request(app)
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});
