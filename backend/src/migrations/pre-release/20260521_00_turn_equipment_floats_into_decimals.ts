import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('equipment', 'weight', {
    type: DataTypes.DECIMAL(5, 2)
  });

  await queryInterface.changeColumn('equipment', 'starting_weight', {
    type: DataTypes.DECIMAL(5, 2)
  });

  await queryInterface.changeColumn('equipment', 'maximum_weight', {
    type: DataTypes.DECIMAL(5, 2)
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('equipment', 'weight', {
    type: DataTypes.FLOAT
  });

  await queryInterface.changeColumn('equipment', 'starting_weight', {
    type: DataTypes.FLOAT
  });

  await queryInterface.changeColumn('equipment', 'maximum_weight', {
    type: DataTypes.FLOAT
  });
};

export { up, down };
