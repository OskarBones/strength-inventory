import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'gyms',
    'opening_hours',
    'opening_hours_everyone'
  );

  await queryInterface.addColumn('gyms', 'opening_hours_members', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });

  await queryInterface.addColumn('gyms', 'opening_hours_exceptions', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });

  await queryInterface.changeColumn('memberships', 'availability', {
    type: DataTypes.JSON,
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'gyms',
    'opening_hours_everyone',
    'opening_hours'
  );

  await queryInterface.removeColumn('gyms', 'opening_hours_members');

  await queryInterface.removeColumn('gyms', 'opening_hours_exceptions');

  await queryInterface.changeColumn('memberships', 'availability', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });
};

export { up, down };
