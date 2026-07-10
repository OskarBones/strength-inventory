import Express, { type Request, type Response } from 'express';

import { equipmentParser, isAdmin, targetEquipmentExtractor }
  from '../utils/middleware.ts';

import { Equipment } from '../models/index.js';

import {
  type EquipmentPostAndPut,
  EquipmentSchema,
  type Equipment as FullEquipment
} from '@strength-inventory/schemas';

const equipmentRouter = Express.Router();

// GET all equipment
equipmentRouter.get('/', async (_req, res) => {
  const equipment = await Equipment.findAll();
  return res.json(equipment);
});

// GET a piece of equipment
// targetEquipmentExtractor returns same includes as the above GET all route
equipmentRouter.get('/:id', targetEquipmentExtractor, (req, res) => {
  if (!req.targetEquipment) {
    throw Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const equipment = req.targetEquipment;
  return res.json(equipment);
});

// POST for admins to create a new equipment
equipmentRouter.post(
  '/',
  equipmentParser,
  ...isAdmin,
  async (
    req: Request<unknown, unknown, EquipmentPostAndPut>,
    res: Response<FullEquipment>
  ) => {
    const {
      name,
      category,
      subcategory,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      maximumWeightType,
      outOfProduction,
      url,
      notes
    } = req.body;

    const equipment = await Equipment.create({
      name,
      category,
      subcategory,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      maximumWeightType,
      outOfProduction,
      url,
      notes
    });

    /* Satisfy TS when it comes to weights' discriminated union. */
    const validatedEquipment = EquipmentSchema.parse(equipment);
    return res.json(validatedEquipment);
  }
);

// PUT for admins to modify everything except id and timestamps
equipmentRouter.put(
  '/:id',
  equipmentParser,
  ...isAdmin,
  targetEquipmentExtractor,
  async (
    req: Request<{ id: string; }, unknown, EquipmentPostAndPut>,
    res: Response<FullEquipment>
  ) => {
    if (!req.targetEquipment) {
      throw Error('Equipment missing from request.');
    }  // Should never trigger after middleware.

    const equipment = req.targetEquipment;
    const {
      name,
      category,
      subcategory,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      maximumWeightType,
      outOfProduction,
      url,
      notes
    } = req.body;

    await equipment.update({
      name: name,
      category: category,
      subcategory: subcategory,
      manufacturer: manufacturer,
      code: code,
      weightUnit: weightUnit,
      weight: weight,
      startingWeight: startingWeight,
      availableWeights: availableWeights,
      maximumWeight: maximumWeight,
      maximumWeightType: maximumWeightType,
      outOfProduction: outOfProduction,
      url: url,
      notes: notes
    });
    await equipment.save();

    /* Satisfy TS when it comes to weights' discriminated union. */
    const validatedEquipment = EquipmentSchema.parse(equipment);
    return res.status(200).json(validatedEquipment);
  }
);

// DELETE for admins to delete an equipment
equipmentRouter.delete(
  '/:id',
  ...isAdmin,
  targetEquipmentExtractor,
  async (req, res) => {
    if (!req.targetEquipment) {
      throw Error('Equipment missing from request.');
    }  // Should never trigger after middleware.

    const equipment = req.targetEquipment;
    await equipment.destroy();

    return res.status(204).end();
  }
);

export default equipmentRouter;
