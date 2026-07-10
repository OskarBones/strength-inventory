import Express, { type Request, type Response } from 'express';

import {
  equipmentCountParser,
  isAdmin,
  isAdminOrManager,
  targetGymEquipmentExtractor,
  targetGymExtractor
} from '../utils/middleware.ts';

import { GymEquipment } from '../models/index.ts';

import type {
  GymEquipment as FullGymEquipment,
  GymEquipmentPost
} from '@strength-inventory/schemas';

const gymEquipmentRouter = Express.Router();

// GET all junctions
gymEquipmentRouter.get('/', async (_req, res) => {
  const junctions = await GymEquipment.findAll();
  return res.json(junctions);
});

// POST for admins to create a new junction
// Frontend instead routes in gyms.ts to add equipment to gyms.
gymEquipmentRouter.post(
  '/:id',
  targetGymExtractor,
  ...isAdmin,
  async (
    req: Request<{ id: string; }, unknown, GymEquipmentPost>,
    res: Response<FullGymEquipment>
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gymId = req.targetGym.id;
    const { equipmentId } = req.body;

    const junction = await GymEquipment.create({ gymId, equipmentId });

    return res.status(201).json(junction);
  }
);

// PATCH for admins and managers to set the number of equipment at some gym
gymEquipmentRouter.patch(
  '/:id',
  equipmentCountParser,
  targetGymEquipmentExtractor,
  ...isAdminOrManager,
  async (
    req: Request<{ id: string }, unknown, { count: number }>,
    res
  ) => {
    if (!req.targetGymEquipment) {
      throw Error('Association missing from request.');
    }  // Should never trigger after middleware.

    const junction = req.targetGymEquipment;
    const { count } = req.body;

    await junction.update({
      count: count
    });
    await junction.save();

    return res.status(200).json(junction);
  }
);

// DELETE for admins to delete a junction
// Frontend instead uses routes in gyms.ts to remove equipment from gyms.
gymEquipmentRouter.delete(
  '/:id',
  targetGymEquipmentExtractor,
  ...isAdmin,
  async (req, res) => {
    if (!req.targetGymEquipment) {
      throw Error('Association missing from request.');
    }  // Should never trigger after middleware.

    const junction = req.targetGymEquipment;
    await junction.destroy();

    return res.status(204).end();
  }
);

export default gymEquipmentRouter;
