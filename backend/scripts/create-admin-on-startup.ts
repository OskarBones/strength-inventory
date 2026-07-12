// only for development

import { genSaltSync, hashSync } from 'bcrypt-ts';

import { connectToDatabase, sequelize } from '../src/utils/db.ts';

import { User } from '../src/models/index.ts';

const seedAdmin = async () => {
  try {
    await connectToDatabase();
    const admin = await User.findOne({ where: { username: 'TheAdmin' } });

    if (!admin) {
      const salt = genSaltSync(10);
      const passwordHash = hashSync(
        'ThereIsOnlyWeightAndThoseTooWeakToLiftIt',
        salt
      );

      await User.create({
        username: 'TheAdmin',
        email: 'admin@strengthinventory.eu',
        emailVerified: true,
        passwordHash,
        name: 'The Admin',
        role: 'ADMIN'
      });
    }

    console.log('Admin user available in the database.');
    await sequelize.close();
    console.log('Seeding script disconnected from the database.');
  } catch (err) {
    console.error('Seeding admin failed:', err);
  }
};

await seedAdmin();
