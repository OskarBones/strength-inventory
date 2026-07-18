import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gymequipment', 'count', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gymequipment', 'count');
};

export { up, down };
