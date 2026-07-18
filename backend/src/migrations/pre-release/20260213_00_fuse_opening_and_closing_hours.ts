import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gyms', 'closing_hours');
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gyms', 'closing_hours', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });
};

export { up, down };
