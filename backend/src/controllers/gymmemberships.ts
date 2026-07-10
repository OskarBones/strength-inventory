import Express, { type Request, type Response } from 'express';

import {
  isAdmin,
  targetGymExtractor,
  targetGymMembershipExtractor
} from '../utils/middleware.ts';

import { GymMemberships } from '../models/index.ts';

import type {
  GymMembership as FullGymMembership,
  GymMembershipPostAndDelete
} from '@strength-inventory/schemas';

const gymMembershipsRouter = Express.Router();

// GET all junctions
gymMembershipsRouter.get('/', async (_req, res) => {
  const junctions = await GymMemberships.findAll();
  return res.json(junctions);
});

// POST for admins to create a new junction
// Frontend instead uses routes in gyms.ts to add memberships to gyms.
gymMembershipsRouter.post(
  '/:id',
  targetGymExtractor,
  ...isAdmin,
  async (
    req: Request<{ id: string; }, unknown, GymMembershipPostAndDelete>,
    res: Response<FullGymMembership>
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gymId = req.targetGym.id;
    const { membershipId } = req.body;

    const junction = await GymMemberships.create({ gymId, membershipId });

    return res.status(201).json(junction);
  }
);

// DELETE for admins to delete a junction
// Frontend instead routes in gyms.ts to remove memberships from gyms.
gymMembershipsRouter.delete(
  '/:id',
  targetGymMembershipExtractor,
  ...isAdmin,
  async (req, res) => {
    if (!req.targetGymMembership) {
      throw Error('Association missing from request.');
    }  // Should never trigger after middleware.

    const junction = req.targetGymMembership;
    await junction.destroy();

    return res.status(204).end();
  }
);

export default gymMembershipsRouter;
