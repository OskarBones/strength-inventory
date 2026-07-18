import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('SUPERUSER', 'ADMIN', 'GYM-OWNER', 'GYM-GOER'),
      allowNull: false,
      defaultValue: 'GYM-GOER'
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('users');
};

export { up, down };
