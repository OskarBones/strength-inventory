import Express, { type Request, type Response } from 'express';

import { isAdmin, targetMembershipExtractor } from '../utils/middleware.ts';

import { Membership } from '../models/index.ts';

import {
  type Membership as FullMembership,
  type MembershipPostAndPut,
  MembershipSchema
} from '@strength-inventory/schemas';

const membershipsRouter = Express.Router();

// GET all memberships
membershipsRouter.get('/', async (_req, res) => {
  const memberships = await Membership.findAll();
  return res.json(memberships);
});

// GET all memberships in a selected country
membershipsRouter.get('/country/:country', async (
  req: Request<{ country: string }, unknown, unknown>,
  res
) => {
  const { country } = req.params;

  const memberships = await Membership.findAll({ where: { country: country } });
  return res.json(memberships);
});

// GET a membership
membershipsRouter.get('/:id', targetMembershipExtractor, (req, res) => {
  if (!req.targetMembership) {
    throw Error('Membership missing from request.');
  }  // Should never trigger after middleware.

  const membership = req.targetMembership;
  return res.json(membership);
});

// POST for admins to create a new membership
membershipsRouter.post(
  '/',
  ...isAdmin,
  async (
    req: Request<unknown, unknown, MembershipPostAndPut>,
    res: Response<FullMembership>
  ) => {
    const {
      chain,
      country,
      name,
      initiationFee,
      membershipFee,
      feeCurrency,
      visits,
      validity,
      validityUnit,
      commitment,
      commitmentUnit,
      autoRenewal,
      availability,
      url,
      notes
    } = req.body;

    const membership = await Membership.create({
      chain,
      country,
      name,
      initiationFee,
      membershipFee,
      feeCurrency,
      visits,
      validity,
      validityUnit,
      commitment,
      commitmentUnit,
      autoRenewal,
      availability,
      url,
      notes
    });

    /* Satisfy TS when it comes to commitment's discriminated union. */
    const validatedMembership = MembershipSchema.parse(membership);
    return res.status(201).json(validatedMembership);
  }
);

// PUT for admins to modify everything except id and timestamps
membershipsRouter.put(
  '/:id',
  ...isAdmin,
  targetMembershipExtractor,
  async (
    req: Request<{ id: string; }, unknown, MembershipPostAndPut>,
    res: Response<FullMembership>
  ) => {
    if (!req.targetMembership) {
      throw Error('Membership missing from request.');
    }  // Should never trigger after middleware.

    const membership = req.targetMembership;
    const {
      chain,
      name,
      initiationFee,
      membershipFee,
      feeCurrency,
      visits,
      validity,
      validityUnit,
      commitment,
      commitmentUnit,
      autoRenewal,
      availability,
      url,
      notes
    } = req.body;

    await membership.update({
      chain: chain,
      name: name,
      initiationFee: initiationFee,
      membershipFee: membershipFee,
      feeCurrency: feeCurrency,
      visits: visits,
      validity: validity,
      validityUnit: validityUnit,
      commitment: commitment,
      commitmentUnit: commitmentUnit,
      autoRenewal: autoRenewal,
      availability: availability,
      url: url,
      notes: notes
    });
    await membership.save();

    /* Satisfy TS when it comes to commitment's discriminated union. */
    const validatedMembership = MembershipSchema.parse(membership);
    return res.status(200).json(validatedMembership);
  }
);

// DELETE for admins to delete a membership
membershipsRouter.delete( // TODO: add (chain) manager permissions
  '/:id',
  targetMembershipExtractor,
  ...isAdmin,
  async (req, res) => {
    if (!req.targetMembership) {
      throw Error('Membership missing from request.');
    }  // Should never trigger after middleware.

    const membership = req.targetMembership;
    await membership.destroy();

    return res.status(204).end();
  }
);

export default membershipsRouter;
