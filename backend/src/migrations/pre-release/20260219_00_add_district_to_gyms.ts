import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gyms', 'district', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.bulkUpdate('gyms', { district: 'undefined' }, {});

  await queryInterface.changeColumn('gyms', 'district', {
    type: DataTypes.STRING,
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gyms', 'district');
};

export { up, down };
