import Express, { type Request, type Response } from 'express';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import {
  isAdmin,
  isSelf,
  isSelfOrAdmin,
  newEmailParser,
  newNamesParser,
  newPasswordParser,
  newUserParser,
  putUserParser,
  roleParser,
  targetUserExtractor
} from '../utils/middleware.ts';

import { User } from '../models/index.js';

import type {
  User as FullUser,
  UserPost,
  UserPut,
  UserRole
} from '@strength-inventory/schemas';

const usersRouter = Express.Router();

// GET all users
usersRouter.get('/', async (_req, res) => {
  const users = await User.findAll();

  return res.json(users);
});

// POST a new user
usersRouter.post(
  '/',
  newUserParser,
  async (req: Request<unknown, unknown, UserPost>, res: Response<FullUser>) => {
    const { password, ...others } = req.body;

    const salt = genSaltSync(10);
    const passwordHash = hashSync(password, salt);

    const user: FullUser = await User.create({ passwordHash, ...others });

    return res.status(201).json(user);
  }
);

// PATCH for users to change username and/or name
usersRouter.patch(
  '/:id',
  newNamesParser,
  ...isSelf,
  async (
    req: Request<{ id: string; }, unknown, { username: string, name: string; }>,
    res: Response<FullUser>
  ) => {
    if (!req.user) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const user = req.user;
    const { username, name } = req.body;

    await user.update({ username: username, name: name });
    await user.save();

    return res.status(200).json(user);
  }
);

// PATCH for users to change email
usersRouter.patch(
  '/:id/email',
  newEmailParser,
  ...isSelf,
  async (
    req: Request<{ id: string; }, unknown, { email: string; }>,
    res: Response<FullUser>
  ) => {
    if (!req.user) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const user = req.user;
    const { email } = req.body;

    await user.update({ email: email, emailVerified: false });
    await user.save();

    return res.status(200).json(user);
  }
);

// PATCH for users to change password
usersRouter.patch(
  '/:id/password',
  newPasswordParser,
  ...isSelf,
  async (
    req: Request<{ id: string; }, unknown, { password: string; }>,
    res: Response<FullUser>
  ) => {
    if (!req.user) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const user = req.user;
    const { password } = req.body;

    const salt = genSaltSync(10);
    const passwordHash = hashSync(password, salt);

    await user.update({ passwordHash: passwordHash });
    await user.save();

    return res.status(200).json(user);
  }
);

// PATCH for admins to change a user's role
usersRouter.patch(
  '/:id/role',
  roleParser,
  ...isAdmin,
  targetUserExtractor,
  async (
    req: Request<{ id: string; }, unknown, { role: UserRole; }>,
    res: Response<FullUser>
  ) => {
    if (!req.targetUser) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const user = req.targetUser;
    const { role } = req.body;

    await user.update({ role: role });
    await user.save();

    return res.status(200).json(user);
  }
);

// PUT for admins to modify everything except id and timestamps
usersRouter.put(
  '/:id',
  putUserParser,
  ...isAdmin,
  targetUserExtractor,
  async (
    req: Request<{ id: string; }, unknown, UserPut>,
    res: Response<FullUser>
  ) => {
    if (!req.targetUser) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const user = req.targetUser;
    const { password, ...others } = req.body;

    await user.update({ ...others });
    if (password) {
      const salt = genSaltSync(10);
      const passwordHash = hashSync(password, salt);
      await user.update({ passwordHash: passwordHash });
    }
    await user.save();

    return res.status(200).json(user);
  }
);

// DELETE for admins and users themselves to delete a user
usersRouter.delete(
  '/:id',
  ...isSelfOrAdmin,
  targetUserExtractor,
  async (req, res) => {
    if (!req.targetUser) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const user = req.targetUser;
    await user.destroy();

    return res.status(204).end();
  }
);

export default usersRouter;
