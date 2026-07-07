import Express, { type Request, type Response } from 'express';

import {
  gymDeleteEquipmentParser,
  gymHoursParser,
  gymMembershipParser,
  gymParser,
  gymPostEquipmentParser,
  isAdmin,
  isAdminOrManager,
  targetGymExtractor
} from '../utils/middleware.ts';

import { Equipment, Gym, Membership, User } from '../models/index.ts';

import type {
  Gym as FullGym,
  GymPatchHours,
  GymPostAndPut
} from '@strength-inventory/schemas';

const gymsRouter = Express.Router();

// GET all gyms
gymsRouter.get('/', async (_req, res) => {
  const gyms = await Gym.findAll({
    include: [
      {
        model: User,
        as: 'managers',
        attributes: [
          'id', 'username', 'email', 'name'
        ]
      },
      {
        model: Membership
      },
      {
        model: Equipment
      }
    ]
  });
  return res.json(gyms);
});

// GET a gym
// targetGymExtractor returns same 'include' as the above GET all route
gymsRouter.get('/:id', targetGymExtractor, (req, res) => {
  if (!req.targetGym) {
    throw Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const gym = req.targetGym;
  return res.json(gym);
});

// GET a gym's equipment
gymsRouter.get('/:id/equipment', targetGymExtractor, async (req, res) => {
  if (!req.targetGym) {
    throw Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const equipment = await req.targetGym.getEquipment();
  return res.json(equipment);
});

// GET a gym's memberships
gymsRouter.get('/:id/memberships', targetGymExtractor, async (req, res) => {
  if (!req.targetGym) {
    throw Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const memberships = await req.targetGym.getMemberships();
  return res.json(memberships);
});

// POST for admins to create a new gym
gymsRouter.post(
  '/',
  gymParser,
  ...isAdmin,
  async (
    req: Request<unknown, unknown, GymPostAndPut>,
    res: Response<FullGym>
  ) => {
    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      country,
      latitude,
      longitude,
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions,
      url,
      location,
      equipmentVisible,
      membershipsVisible,
      openingHoursVisible,
      notes
    } = req.body;

    const gym = await Gym.create({
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      country,
      latitude,
      longitude,
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions,
      url,
      location,
      equipmentVisible,
      membershipsVisible,
      openingHoursVisible,
      notes
    });

    return res.status(201).json(gym);
  }
);

// POST for admins and managers to add equipment
gymsRouter.post(
  '/:id/equipment',
  gymPostEquipmentParser,
  ...isAdminOrManager,
  targetGymExtractor,
  async (
    req:
    Request<{ id: string }, unknown, { equipmentId: string, count: number }>,
    res
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const { equipmentId, count } = req.body;
    await gym.addEquipment(equipmentId, { through: { count: count } });

    return res.status(201).json({ gymId: gym.id, equipmentId: equipmentId });
  }
);

// POST for admins and managers to add a membership
gymsRouter.post(
  '/:id/memberships',
  gymMembershipParser,
  ...isAdminOrManager,
  targetGymExtractor,
  async (
    req: Request<{ id: string }, unknown, { membershipId: string }>,
    res
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const { membershipId } = req.body;
    await gym.addMembership(membershipId);

    return res.status(201).json({ gymId: gym.id, membershipId: membershipId });
  }
);

// PUT for admins to modify everything except id and timestamps
gymsRouter.put(
  '/:id',
  gymParser,
  ...isAdmin,
  targetGymExtractor,
  async (
    req: Request<{ id: string; }, unknown, GymPostAndPut>,
    res: Response<FullGym>
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      country,
      latitude,
      longitude,
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions,
      url,
      location,
      equipmentVisible,
      membershipsVisible,
      openingHoursVisible,
      notes
    } = req.body;

    await gym.update({
      name: name,
      chain: chain,
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      country: country,
      latitude: latitude,
      longitude: longitude,
      openingHoursEveryone: openingHoursEveryone,
      openingHoursMembers: openingHoursMembers,
      openingHoursExceptions: openingHoursExceptions,
      url: url,
      location: location,
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes
    });
    await gym.save();

    return res.status(200).json(gym);
  }
);

// PATCH for admins and managers to edit opening hours
gymsRouter.patch(
  '/:id',
  gymHoursParser,
  targetGymExtractor,
  ...isAdminOrManager,
  async (
    req: Request<{ id: string; }, unknown, GymPatchHours>,
    res: Response<FullGym>
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const {
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions
    } = req.body;

    await gym.update({
      openingHoursEveryone: openingHoursEveryone,
      openingHoursMembers: openingHoursMembers,
      openingHoursExceptions: openingHoursExceptions
    });
    await gym.save();

    return res.status(200).json(gym);
  }
);

// DELETE for admins to delete a gym
gymsRouter.delete('/:id', ...isAdmin, targetGymExtractor, async (req, res) => {
  if (!req.targetGym) {
    throw Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const gym = req.targetGym;
  await gym.destroy();

  return res.status(204).end();
});

// DELETE for admins and managers to remove equipment
gymsRouter.delete(
  '/:id/equipment',
  gymDeleteEquipmentParser,
  ...isAdminOrManager,
  targetGymExtractor,
  async (
    req: Request<{ id: string }, unknown, { equipmentId: string }>,
    res
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const { equipmentId } = req.body;
    await gym.removeEquipment(equipmentId);

    return res.status(200).json({ gymId: gym.id, equipmentId: equipmentId });
  }
);

// DELETE for admins and managers to remove a membership
gymsRouter.delete(
  '/:id/memberships',
  gymMembershipParser,
  ...isAdminOrManager,
  targetGymExtractor,
  async (
    req: Request<{ id: string }, unknown, { membershipId: string }>,
    res
  ) => {
    if (!req.targetGym) {
      throw Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const { membershipId } = req.body;
    await gym.removeMembership(membershipId);

    return res.status(200).json({ gymId: gym.id, membershipId: membershipId });
  }
);

export default gymsRouter;
