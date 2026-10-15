import { Op } from 'sequelize';

import { connectToDatabase, sequelize } from '../src/utils/db.ts';

import { Session } from '../src/models/index.ts';

const deleteExpiredSessions = async () => {
  try {
    await connectToDatabase();
    console.log('Cleanup script connected to the database.');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await Session.destroy({
      where: {
        createdAt: {
          [Op.lt]: sevenDaysAgo
        }
      }
    });

    console.log('Expired sessions deleted from the database.');

    await sequelize.close();
    console.log('Cleanup script disconnected from the database.');
  } catch (err) {
    console.error('Deleting expired sessions failed:', err);
    process.exit(1);
  }
};

await deleteExpiredSessions();
