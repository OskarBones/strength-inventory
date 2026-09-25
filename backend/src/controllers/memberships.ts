import Express, { type Request, type Response } from 'express';

import {
  isAdmin,
  membershipPostParser,
  membershipPutParser,
  targetMembershipExtractor
} from '../utils/middleware.ts';

import { Membership } from '../models/index.ts';

import {
  type Membership as FullMembership,
  type MembershipPost,
  type MembershipPut,
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
  membershipPostParser,
  ...isAdmin,
  async (
    req: Request<unknown, unknown, MembershipPost>,
    res: Response<FullMembership>
  ) => {
    const membership = await Membership.create(req.body);

    /* Satisfy TS when it comes to commitment's discriminated union. */
    const validatedMembership = MembershipSchema.parse(membership);
    return res.status(201).json(validatedMembership);
  }
);

// PUT for admins to modify everything except id and timestamps
membershipsRouter.put(
  '/:id',
  membershipPutParser,
  ...isAdmin,
  targetMembershipExtractor,
  async (
    req: Request<{ id: string; }, unknown, MembershipPut>,
    res: Response<FullMembership>
  ) => {
    if (!req.targetMembership) {
      throw Error('Membership missing from request.');
    }  // Should never trigger after middleware.

    const membership = req.targetMembership;

    await membership.update(req.body);
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
