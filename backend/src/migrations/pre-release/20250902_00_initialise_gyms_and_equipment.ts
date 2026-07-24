import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('gyms', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    street_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
  await queryInterface.createTable('equipment', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight_unit: {
      type: DataTypes.ENUM('kg', 'lbs')
    },
    weight: {
      type: DataTypes.FLOAT
    },
    starting_weight: {
      type: DataTypes.FLOAT
    },
    available_weights: {
      type: DataTypes.JSON
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('gyms');
  await queryInterface.dropTable('equipment');
};

export { up, down };
