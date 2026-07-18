import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('sessions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING, // migrate to Sequalize UUID
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('sessions');
};

export { up, down };
