import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'memberships',
    'price_currency',
    'fee_currency'
  );

  await queryInterface.renameColumn(
    'memberships',
    'price',
    'membership_fee'
  );

  await queryInterface.changeColumn('memberships', 'membership_fee', {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  });

  await queryInterface.addColumn('memberships', 'initiation_fee', {
    type: DataTypes.DECIMAL(10, 2)
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'memberships',
    'fee_currency',
    'price_currency'
  );

  await queryInterface.renameColumn(
    'memberships',
    'membership_fee',
    'price'
  );

  await queryInterface.changeColumn('memberships', 'price', {
    type: DataTypes.FLOAT,
    allowNull: false
  });

  await queryInterface.removeColumn('memberships', 'initiation_fee');
};

export { up, down };
