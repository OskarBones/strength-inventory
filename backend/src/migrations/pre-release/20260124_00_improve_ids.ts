import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeConstraint('sessions', 'sessions_user_id_fkey');

  await queryInterface.sequelize.query(
    'ALTER TABLE "users" ALTER COLUMN "id" TYPE UUID USING "id"::uuid'
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len
    'ALTER TABLE "sessions" ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid'
  );

  await queryInterface.changeColumn('users', 'id', {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  });

  await queryInterface.addConstraint('sessions', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'sessions_user_id_fkey',
    references: {
      table: 'users',
      field: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  await queryInterface.sequelize.query(
    'ALTER TABLE "gyms" ALTER COLUMN "id" TYPE UUID USING "id"::uuid'
  );
  await queryInterface.changeColumn('gyms', 'id', {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  });

  await queryInterface.sequelize.query(
    'ALTER TABLE "equipment" ALTER COLUMN "id" TYPE UUID USING "id"::uuid'
  );
  await queryInterface.changeColumn('equipment', 'id', {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  });

  await queryInterface.sequelize.query(
    'ALTER TABLE "sessions" ALTER COLUMN "id" TYPE UUID USING "id"::uuid'
  );
  await queryInterface.changeColumn('sessions', 'id', {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeConstraint('sessions', 'sessions_user_id_fkey');

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len
    'ALTER TABLE "users" ALTER COLUMN "id" TYPE VARCHAR(255) USING "id"::varchar'
  );  // Sequelize STRING defaults to VARCHAR(255)
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len
    'ALTER TABLE "sessions" ALTER COLUMN "user_id" TYPE VARCHAR(255) USING "user_id"::varchar'
  );  // Sequelize STRING defaults to VARCHAR(255)

  await queryInterface.changeColumn('users', 'id', {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  });

  await queryInterface.addConstraint('sessions', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'sessions_user_id_fkey',
    references: {
      table: 'users',
      field: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  await queryInterface.sequelize.query(
    'ALTER TABLE "gyms" ALTER COLUMN "id" TYPE VARCHAR(255) USING "id"::varchar'
  );  // Sequelize STRING defaults to VARCHAR(255)
  await queryInterface.changeColumn('gyms', 'id', {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len
    'ALTER TABLE "equipment" ALTER COLUMN "id" TYPE VARCHAR(255) USING "id"::varchar'
  );  // Sequelize STRING defaults to VARCHAR(255)
  await queryInterface.changeColumn('equipment', 'id', {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len
    'ALTER TABLE "sessions" ALTER COLUMN "id" TYPE VARCHAR(255) USING "id"::varchar'
  );  // Sequelize STRING defaults to VARCHAR(255)
  await queryInterface.changeColumn('sessions', 'id', {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  });
};

export { up, down };
