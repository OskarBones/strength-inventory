import Express, { type Request, type Response } from 'express';

import { isAdmin, targetCityExtractor } from '../utils/middleware.ts';

import { City, District } from '../models/index.ts';

import type { CityPostAndPut, City as FullCity }
  from '@strength-inventory/schemas';

const citiesRouter = Express.Router();

// GET all cities
citiesRouter.get('/', async (_req, res) => {
  const cities = await City.findAll({ include: District });
  return res.json(cities);
});

// GET a city
// targetCityExtractor returns same 'include' as the above GET all route
citiesRouter.get('/:id', targetCityExtractor, (req, res) => {
  if (!req.targetCity) {
    throw Error('City missing from request.');
  }  // Should never trigger after middleware.

  const city = req.targetCity;
  return res.json(city);
});

// POST for admins to create a city
citiesRouter.post(
  '/',
  ...isAdmin,
  async (
    req: Request<unknown, unknown, CityPostAndPut>,
    res: Response<FullCity>
  ) => {
    const {
      name,
      referencePoint,
      latitude,
      longitude,
      country
    } = req.body;

    const city = await City.create({
      name,
      referencePoint,
      latitude,
      longitude,
      country
    });

    return res.status(201).json(city);
  }
);

// PUT for admins to modify everything except id and timestamps
citiesRouter.put(
  '/:id',
  ...isAdmin,
  targetCityExtractor,
  async (
    req: Request<{ id: string }, unknown, CityPostAndPut>,
    res: Response<FullCity>
  ) => {
    if (!req.targetCity) {
      throw Error('City missing from request.');
    }  // Should never trigger after middleware.

    const city = req.targetCity;
    const {
      name,
      referencePoint,
      latitude,
      longitude,
      country
    } = req.body;

    await city.update({
      name: name,
      referencePoint: referencePoint,
      latitude: latitude,
      longitude: longitude,
      country: country
    });
    await city.save();

    return res.status(200).json(city);
  }
);

// DELETE for admins to delete a city
citiesRouter.delete(
  '/:id',
  ...isAdmin,
  targetCityExtractor,
  async (req, res) => {
    if (!req.targetCity) {
      throw Error('City missing from request.');
    }  // Should never trigger after middleware.

    const city = req.targetCity;
    await city.destroy();

    return res.status(204).end();
  }
);

export default citiesRouter;
