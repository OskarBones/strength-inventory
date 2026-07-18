import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'sessions',
    'token',
    'access_token'
  );

  await queryInterface.addColumn('sessions', 'refresh_token', {
    type: DataTypes.STRING,
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'sessions',
    'access_token',
    'token'
  );

  await queryInterface.removeColumn('sessions', 'refresh_token');
};

export { up, down };
