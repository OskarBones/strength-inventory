import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('memberships', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    price_currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    validity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    validity_unit: {
      type: DataTypes.ENUM('year', 'month', 'week', 'day', 'hour'),
      allowNull: false
    },
    commitment: {
      type: DataTypes.INTEGER
    },
    commitment_unit: {
      type: DataTypes.ENUM('year', 'month', 'week', 'day', 'hour')
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    url: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.STRING
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });

  await queryInterface.createTable('gymmemberships', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    gym_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'gyms', key: 'id' }
    },
    membership_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'memberships', key: 'id' }
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });

  await queryInterface.addColumn('gyms', 'url', {
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('equipment', 'url', {
    type: DataTypes.STRING
  });

  await queryInterface.renameColumn('gymmanagers', 'userId', 'user_id');
  await queryInterface.renameColumn('gymmanagers', 'gymId', 'gym_id');
  await queryInterface.renameColumn('gymmanagers', 'createdAt', 'created_at');
  await queryInterface.renameColumn('gymmanagers', 'updatedAt', 'updated_at');
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_userId_fkey');
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_gymId_fkey');
  await queryInterface.renameColumn('gymequipment', 'gymId', 'gym_id');
  await queryInterface
    .renameColumn('gymequipment', 'equipmentId', 'equipment_id');
  await queryInterface.renameColumn('gymequipment', 'createdAt', 'created_at');
  await queryInterface.renameColumn('gymequipment', 'updatedAt', 'updated_at');
  await queryInterface
    .removeConstraint('gymequipment', 'gymequipment_gymId_fkey');
  await queryInterface
    .removeConstraint('gymequipment', 'gymmequipment_equipmentId_fkey');

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
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('memberships');

  await queryInterface.dropTable('gymmemberships');

  await queryInterface.removeColumn('gyms', 'url');
  await queryInterface.removeColumn('equipment', 'url');

  await queryInterface.renameColumn('gymmanagers', 'user_id', 'userId');
  await queryInterface.renameColumn('gymmanagers', 'gym_id', 'gymId');
  await queryInterface.renameColumn('gymmanagers', 'created_at', 'createdAt');
  await queryInterface.renameColumn('gymmanagers', 'updated_at', 'updatedAt');
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_user_id_fkey');
  await queryInterface
    .removeConstraint('gymmanagers', 'gymmanagers_gym_id_fkey');
  await queryInterface.renameColumn('gymequipment', 'gym_id', 'gymId');
  await queryInterface
    .renameColumn('gymequipment', 'equipment_id', 'equipmentId');
  await queryInterface.renameColumn('gymequipment', 'created_at', 'createdAt');
  await queryInterface.renameColumn('gymequipment', 'updated_at', 'updatedAt');
  await queryInterface
    .removeConstraint('gymequipment', 'gymequipment_gym_id_fkey');
  await queryInterface
    .removeConstraint('gymequipment', 'gymmequipment_equipment_id_fkey');

  await queryInterface.changeColumn('gymmanagers', 'userId', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  });

  await queryInterface.changeColumn('gymmanagers', 'gymId', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  });

  await queryInterface.changeColumn('gymequipment', 'gymId', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  });

  await queryInterface.changeColumn('gymequipment', 'equipmentId', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'equipment', key: 'id' }
  });
};

export { up, down };
