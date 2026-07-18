import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('sessions', 'access_token', {
    type: DataTypes.STRING(510),
    allowNull: false
  });

  await queryInterface.changeColumn('sessions', 'refresh_token', {
    type: DataTypes.STRING(510),
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('sessions', 'access_token', {
    type: DataTypes.STRING,
    allowNull: false
  });

  await queryInterface.changeColumn('sessions', 'refresh_token', {
    type: DataTypes.STRING,
    allowNull: false
  });
};

export { up, down };
