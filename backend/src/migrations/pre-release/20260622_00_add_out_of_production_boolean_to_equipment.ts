import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('equipment', 'out_of_production', {
    type: DataTypes.BOOLEAN
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET out_of_production = 'f'"
  );
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('equipment', 'out_of_production');
};

export { up, down };
