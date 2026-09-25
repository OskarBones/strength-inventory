import Express, { type Request, type Response } from 'express';

import { isAdmin, targetGymManagerExtractor } from '../utils/middleware.ts';

import { GymManagers } from '../models/index.ts';

import type {
  GymManager as FullGymManager,
  GymManagerPostAndDelete
} from '@strength-inventory/schemas';

const gymManagersRouter = Express.Router();

// GET all junctions
gymManagersRouter.get('/', async (_req, res) => {
  const junctions = await GymManagers.findAll();
  return res.json(junctions);
});

// POST for admins to create a new junction
// Frontend will instead use routes in gyms.ts to add managers to gyms.
gymManagersRouter.post(
  '/',
  ...isAdmin,
  async (
    req: Request<unknown, unknown, GymManagerPostAndDelete>,
    res: Response<FullGymManager>
  ) => {
    const junction = await GymManagers.create(req.body);

    return res.status(201).json(junction);
  }
);

// DELETE for admins to delete a junction
// Frontend will instead use routes in gyms.ts to remove managers from gyms.
gymManagersRouter.delete(
  '/:id',
  ...isAdmin,
  targetGymManagerExtractor,
  async (req, res) => {
    if (!req.targetGymManager) {
      throw new Error('Association missing from request.');
    }  // Should never trigger after middleware.

    const junction = req.targetGymManager;
    await junction.destroy();

    return res.status(204).end();
  }
);

export default gymManagersRouter;
