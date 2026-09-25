import Express, { type Request, type Response } from 'express';

import {
  districtPostParser,
  districtPutParser,
  isAdmin,
  targetDistrictExtractor
} from '../utils/middleware.ts';

import { City, District } from '../models/index.ts';

import type { DistrictPost, DistrictPut, District as FullDistrict }
  from '@strength-inventory/schemas';

const districtsRouter = Express.Router();

// GET all districts
districtsRouter.get('/', async (_req, res) => {
  const districts = await District.findAll({ include: City });
  return res.json(districts);
});

// GET a district
// targetDistrictExtractor returns same 'include' as the above GET all route
districtsRouter.get('/:id', targetDistrictExtractor, (req, res) => {
  if (!req.targetDistrict) {
    throw Error('District missing from request.');
  }  // Should never trigger after middleware.

  const district = req.targetDistrict;
  return res.json(district);
});

// POST for admins to create a district
districtsRouter.post(
  '/',
  districtPostParser,
  ...isAdmin,
  async (
    req: Request<unknown, unknown, DistrictPost>,
    res: Response<FullDistrict>
  ) => {
    const district = await District.create(req.body);
    return res.status(201).json(district);
  }
);

// PUT for admins to modify everything except id and timestamps
districtsRouter.put(
  '/:id',
  districtPutParser,
  ...isAdmin,
  targetDistrictExtractor,
  async (
    req: Request<{ id: string }, unknown, DistrictPut>,
    res: Response<FullDistrict>
  ) => {
    if (!req.targetDistrict) {
      throw Error('District missing from request.');
    }  // Should never trigger after middleware.

    const district = req.targetDistrict;

    await district.update(req.body);
    await district.save();

    return res.status(200).json(district);
  }
);

// DELETE for admins to delete a district
districtsRouter.delete(
  '/:id',
  ...isAdmin,
  targetDistrictExtractor,
  async (req, res) => {
    if (!req.targetDistrict) {
      throw Error('District missing from request.');
    }  // Should never trigger after middleware.

    const district = req.targetDistrict;
    await district.destroy();

    return res.status(204).end();
  }
);

export default districtsRouter;
