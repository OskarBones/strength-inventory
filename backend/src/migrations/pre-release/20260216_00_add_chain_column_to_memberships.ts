import { DataTypes } from 'sequelize';
import {
  type Migration
} from '../utils/db.ts';  // .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('memberships', 'chain', {
    type: DataTypes.STRING
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('memberships', 'chain');
};

export { up, down };
