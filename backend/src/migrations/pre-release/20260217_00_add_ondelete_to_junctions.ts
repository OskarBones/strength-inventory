import { DataTypes } from 'sequelize';
import {
  type Migration
} from '../utils/db.ts';  // .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_user_id_fkey');
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymequipment', 'gymequipment_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymequipment', 'gymequipment_equipment_id_fkey');
  await queryInterface
    .removeConstraint('gymmemberships', 'gymmemberships_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymmemberships', 'gymmemberships_membership_id_fkey');

  await queryInterface.changeColumn('gymmanagers', 'user_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  });

  await queryInterface.changeColumn('gymmanagers', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' },
    onDelete: 'CASCADE'
  });

  await queryInterface.changeColumn('gymequipment', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' },
    onDelete: 'CASCADE'
  });

  await queryInterface.changeColumn('gymequipment', 'equipment_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'equipment', key: 'id' },
    onDelete: 'CASCADE'
  });

  await queryInterface.changeColumn('gymmemberships', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' },
    onDelete: 'CASCADE'
  });

  await queryInterface.changeColumn('gymmemberships', 'membership_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'memberships', key: 'id' },
    onDelete: 'CASCADE'
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_user_id_fkey');
  await queryInterface
    .removeConstraint('gymequipment', 'gymequipment_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymequipment', 'gymequipment_equipment_id_fkey');
  await queryInterface
    .removeConstraint('gymmemberships', 'gymmemberships_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymmemberships', 'gymmemberships_membership_id_fkey');

  await queryInterface.changeColumn('gymmanagers', 'user_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  });

  await queryInterface.changeColumn('gymmanagers', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  });

  await queryInterface.changeColumn('gymequipment', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  });

  await queryInterface.changeColumn('gymequipment', 'equipment_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'equipment', key: 'id' }
  });

  await queryInterface.changeColumn('gymmemberships', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  });

  await queryInterface.changeColumn('gymmemberships', 'membership_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'memberships', key: 'id' }
  });
};

export { up, down };
