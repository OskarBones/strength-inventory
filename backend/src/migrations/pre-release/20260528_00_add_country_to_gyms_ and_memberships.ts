import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gyms', 'country', {
    type: DataTypes.STRING
  });

  await queryInterface.addColumn('memberships', 'country', {
    type: DataTypes.STRING
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gyms', 'country');

  await queryInterface.removeColumn('memberships', 'country');
};

export { up, down };
