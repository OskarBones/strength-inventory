/* eslint-disable @stylistic/quotes */
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE gyms SET country = 'FIN' WHERE country = 'Finland'"
  );

  await queryInterface.sequelize.query(
    "UPDATE memberships SET country = 'FIN' WHERE country = 'Finland'"
  );
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE gyms SET country = 'Finland' WHERE country = 'FIN'"
  );

  await queryInterface.sequelize.query(
    "UPDATE memberships SET country = 'Finland' WHERE country = 'FIN'"
  );
};

export { up, down };
