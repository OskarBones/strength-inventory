import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('equipment', 'category', {
    type: DataTypes.ENUM(
      'attachment',
      'cardio',
      'freeWeight',
      'strengthMachine',
      'tool'
    ),
    allowNull: false
  });
  await queryInterface.addColumn('equipment', 'maximum_weight', {
    type: DataTypes.FLOAT
  });
  await queryInterface.addColumn('equipment', 'notes', {
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('gyms', 'city', {
    type: DataTypes.STRING,
    allowNull: false
  });
  await queryInterface.addColumn('gyms', 'opening_hours', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });
  await queryInterface.addColumn('gyms', 'closing_hours', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });
  await queryInterface.addColumn('gyms', 'notes', {
    type: DataTypes.STRING
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('equipment', 'category');
  await queryInterface.removeColumn('equipment', 'maximum_weight');
  await queryInterface.removeColumn('equipment', 'notes');
  await queryInterface.removeColumn('gyms', 'city');
  await queryInterface.removeColumn('gyms', 'opening_hours');
  await queryInterface.removeColumn('gyms', 'closing_hours');
  await queryInterface.removeColumn('gyms', 'notes');
};

export { up, down };
