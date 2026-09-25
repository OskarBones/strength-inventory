import Express, { type Request, type Response } from 'express';

import { cityPostParser, cityPutParser, isAdmin, targetCityExtractor }
  from '../utils/middleware.ts';

import { City, District } from '../models/index.ts';

import type { CityPost, CityPut, City as FullCity }
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
  cityPostParser,
  ...isAdmin,
  async (
    req: Request<unknown, unknown, CityPost>,
    res: Response<FullCity>
  ) => {
    const city = await City.create(req.body);
    return res.status(201).json(city);
  }
);

// PUT for admins to modify everything except id and timestamps
citiesRouter.put(
  '/:id',
  cityPutParser,
  ...isAdmin,
  targetCityExtractor,
  async (
    req: Request<{ id: string }, unknown, CityPut>,
    res: Response<FullCity>
  ) => {
    if (!req.targetCity) {
      throw Error('City missing from request.');
    }  // Should never trigger after middleware.

    const city = req.targetCity;

    await city.update(req.body);
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
