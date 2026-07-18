import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('equipment', 'subcategory', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'other'
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('equipment', 'subcategory');
};

export { up, down };
