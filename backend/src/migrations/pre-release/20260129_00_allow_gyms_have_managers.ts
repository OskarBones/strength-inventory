import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "ALTER TYPE enum_users_role RENAME VALUE 'GYM-OWNER' TO 'MANAGER'"
  );

  await queryInterface.createTable('gymmanagers', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    gymId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'gyms', key: 'id' }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  await queryInterface.changeColumn('users', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "ALTER TYPE enum_users_role RENAME VALUE 'MANAGER' TO 'GYM-OWNER'"
  );

  await queryInterface.dropTable('gymmanagers');

  await queryInterface.changeColumn('users', 'name', {
    type: DataTypes.STRING,
    allowNull: false
  });
};

export { up, down };
