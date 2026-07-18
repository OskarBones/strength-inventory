import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gyms', 'equipment_visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });

  await queryInterface.addColumn('gyms', 'memberships_visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });

  await queryInterface.addColumn('gyms', 'opening_hours_visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gyms', 'equipment_visible');
  await queryInterface.removeColumn('gyms', 'memberships_visible');
  await queryInterface.removeColumn('gyms', 'opening_hours_visible');
};

export { up, down };
