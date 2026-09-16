import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('equipment', 'generic', {
    type: DataTypes.BOOLEAN
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET generic = 'f'"
  );

  await queryInterface.changeColumn('equipment', 'generic', {
    type: DataTypes.BOOLEAN,
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('equipment', 'generic');
};

export { up, down };
