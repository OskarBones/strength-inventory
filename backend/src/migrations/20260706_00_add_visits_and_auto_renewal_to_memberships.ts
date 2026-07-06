import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('memberships', 'visits', {
    type: DataTypes.INTEGER
  });

  await queryInterface.addColumn('memberships', 'auto_renewal', {
    type: DataTypes.BOOLEAN
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE memberships SET auto_renewal = 'f'"
  );

  await queryInterface.changeColumn('memberships', 'auto_renewal', {
    type: DataTypes.BOOLEAN,
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('memberships', 'visits');
  await queryInterface.removeColumn('memberships', 'auto_renewal');
};

export { up, down };
