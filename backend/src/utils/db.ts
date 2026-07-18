// reference [4]

import 'ts-node/register';  // Required by Node.js to read .ts migration files.

import { SequelizeStorage, Umzug } from 'umzug';
import { Sequelize } from 'sequelize';

// .ts instead of .js to accommodate Vitest
import { DB_URI, NODE_ENV } from './config.ts';

let sequelizeConfig = {};
if (NODE_ENV === 'production') {
  sequelizeConfig = {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: true }
    }
  };
}

const sequelize = new Sequelize(DB_URI, sequelizeConfig);

let migrationPath: string;
if (NODE_ENV === 'production') {
  migrationPath = 'build/src/migrations/*.js';
} else {
  migrationPath = 'src/migrations/*.ts';
}

const umzug = new Umzug({
  migrations: {
    glob: migrationPath
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Connected to the database.');
  } catch (err: unknown) {
    let errorMessage = 'Failed to connect to the database.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
    return process.exit(1);
  }

  return null;
};

const runMigrations = async () => {
  const migrations = await umzug.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  await umzug.down();
};

export type Migration = typeof umzug._types.migration;

export { connectToDatabase, sequelize, rollbackMigration };
