import {
  afterAll,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import app from '../index.js';
import { login } from './test_utils.ts';

import { Gym, User } from '../models/index.ts';

import { type Gym as FullGym } from '@strength-inventory/schemas';

const initialGymCount = 2;  // the number of gyms created in beforeEach
let token: string;
let cookies: string;

const emptyOpeningHours = {
  MO: [null, null],
  TU: [null, null],
  WE: [null, null],
  TH: [null, null],
  FR: [null, null],
  SA: [null, null],
  SU: [null, null]
};

beforeAll(async () => {
  await User.truncate({ cascade: true });
  let passwordHash: string;
  const salt = genSaltSync(10);

  passwordHash = hashSync('ThereIsOnlyWeightAndThoseTooWeakToLiftIt', salt);
  await User.create({
    username: 'TheAdmin',
    email: 'admin@strengthinventory.eu',
    passwordHash,
    name: 'The Admin',
    role: 'ADMIN'
  });

  passwordHash = hashSync('YourBodyIsTheOnlyPlaceYouHaveToLive', salt);
  await User.create({
    username: 'TheGymOwner',
    email: 'manager@thebestgym.me',
    passwordHash,
    name: 'The Gym Owner',
    role: 'MANAGER'
  });

  passwordHash = hashSync('ILiftThereforeIAm', salt);
  await User.create({
    username: 'LashaTalakhadze',
    email: 'lasha@talakhadze.ge',
    emailVerified: true,
    passwordHash,
    name: 'Lasha Talakhadze'
  });
});

beforeEach(async () => {
  await Gym.truncate({ cascade: true });

  await Gym.create({
    name: 'Fitness24Seven Helsinki Punavuori',
    chain: 'Fitness24Seven',
    street: 'Albertinkatu',
    streetNumber: '29',
    district: 'Punavuori',
    city: 'Helsinki',
    country: 'FIN',
    latitude: 60.16478,
    longitude: 24.93285,
    // eslint-disable-next-line @stylistic/max-len
    url: 'https://fi.fitness24seven.com/kuntokeskuksemme/etsi-salisi/helsinki-punavuori',
    // eslint-disable-next-line @stylistic/max-len
    location: 'https://www.google.com/maps/place/Fitness24Seven+Helsinki+Punavuori/@60.1647969,24.9326237,19.01z/data=!4m6!3m5!1s0x46920bcaeb2bc167:0xbedf5caef2f05ba3!8m2!3d60.1647997!4d24.9328236!16s%2Fg%2F1pv1c151d?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D',
    openingHoursMembers: {
      MO: ['00:00', '23:59'],
      TU: ['00:00', '23:59'],
      WE: ['00:00', '23:59'],
      TH: ['00:00', '23:59'],
      FR: ['00:00', '23:59'],
      SA: ['00:00', '23:59'],
      SU: ['00:00', '23:59']
    },
    equipmentVisible: true,
    membershipsVisible: true,
    openingHoursVisible: true,
    notes: 'Membership required to get in.'
  });

  await Gym.create({
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
    url: 'https://www.elixia.fi/kuntosali/helsinki/kamppi?clubId=727&utm_source=google&utm_medium=organic_location&utm_campaign=pinmeto&utm_id=728',
    // eslint-disable-next-line @stylistic/max-len
    location: 'https://www.google.com/maps/place/ELIXIA+Kamppi/@60.1694856,24.9268664,17z/data=!3m1!4b1!4m6!3m5!1s0x46920a3485cc265d:0xace8b112832c5729!8m2!3d60.169483!4d24.929436!16s%2Fg%2F1q67ml5y5?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D',
    openingHoursEveryone: {
      MO: ['06:00', '22:00'],
      TU: ['06:00', '22:00'],
      WE: ['06:00', '22:00'],
      TH: ['06:00', '22:00'],
      FR: ['06:00', '21:00'],
      SA: ['08:00', '20:00'],
      SU: ['08:00', '20:00']
    },
    equipmentVisible: true,
    membershipsVisible: true,
    openingHoursVisible: true,
    notes: 'A lot of natural light.'
  });
});

afterAll(async () => {
  await User.truncate({ cascade: true });
  await Gym.truncate({ cascade: true });
});

test('GET all gyms correctly returns a json', async () => {
  const response = await request(app)
    .get('/api/gyms')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialGymCount);
});

describe('POST a new gym', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      ({ token, cookies } = await login({
        username: 'TheAdmin',
        password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt'
      }));
    });

    test('succeeds with valid required fields', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      const response: request.Response = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const body = response.body as FullGym;

      expect(body.openingHoursEveryone).toEqual(emptyOpeningHours);
      expect(body.openingHoursMembers).toEqual(emptyOpeningHours);
      expect(body.openingHoursExceptions).toEqual({ data: [] });
      expect(body.equipmentVisible).toEqual(false);
      expect(body.membershipsVisible).toEqual(false);
      expect(body.openingHoursVisible).toEqual(false);
    });

    test('fails if "name" is undefined', async () => {
      const newGym = {
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "street" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "streetNumber" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "district" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "city" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "country" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        latitude: 60.16305,
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "latitude" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        longitude: 24.90255,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "longitude" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        // eslint-disable-next-line @stylistic/max-len
        location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });

    test('fails if "location" is undefined', async () => {
      const newGym = {
        name: 'Mayor\'s Gym',
        street: 'Porkkalankatu',
        streetNumber: '13N',
        district: 'Ruoholahti',
        city: 'Helsinki',
        country: 'FIN',
        latitude: 60.16305,
        longitude: 24.90255
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .send(newGym)
        .expect(400);
    });
  });

  test('fails as a gym-goer', async () => {
    ({ token, cookies } = await login({
      username: 'LashaTalakhadze',
      password: 'ILiftThereforeIAm'
    }));

    const newGym = {
      name: 'Mayor\'s Gym',
      street: 'Porkkalankatu',
      streetNumber: '13N',
      district: 'Ruoholahti',
      city: 'Helsinki',
      country: 'FIN',
      latitude: 60.16305,
      longitude: 24.90255,
      // eslint-disable-next-line @stylistic/max-len
      location: 'https://www.google.com/maps/place/Mayors+Gym/@60.1629998,24.8993245,16z/data=!3m1!4b1!4m6!3m5!1s0x46920a4a81758913:0x6cc4e3a73ece210!8m2!3d60.1629972!4d24.9018941!16s%2Fg%2F11byp6byhf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'
    };

    await request(app)
      .post('/api/gyms')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .send(newGym)
      .expect(403);
  });
});

describe('DELETE a gym', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      ({ token, cookies } = await login({
        username: 'TheAdmin',
        password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt'
      }));
    });

    test('succeeds with a valid id', async () => {
      const startResponse = await request(app)
        .get('/api/gyms');

      expect(startResponse.body).toHaveLength(initialGymCount);

      const gymToDelete: FullGym | null = await Gym.findOne({
        where: { name: 'Fitness24Seven Helsinki Punavuori' }
      });
      assert.isNotNull(gymToDelete);

      await request(app)
        .delete(`/api/gyms/${gymToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(204);

      const endResponse = await request(app)
        .get('/api/gyms');

      expect(endResponse.body).toHaveLength(initialGymCount - 1);
    });

    test('fails with an invalid id', async () => {
      await request(app)
        .delete('/api/gyms/ca16ce67-718e-497a-acbe-011fcdee4745')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookies)
        .expect(404);
    });
  });

  test('fails as a gym-goer', async () => {
    ({ token, cookies } = await login({
      username: 'LashaTalakhadze',
      password: 'ILiftThereforeIAm'
    }));

    const gymToDelete: FullGym | null = await Gym.findOne({
      where: { name: 'Fitness24Seven Helsinki Punavuori' }
    });
    assert.isNotNull(gymToDelete);

    await request(app)
      .delete(`/api/gyms/${gymToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .expect(403);
  });
});
