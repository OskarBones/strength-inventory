import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gyms', 'visible', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE gyms SET visible = 't'"
  );

  await queryInterface.changeColumn('gyms', 'visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });

  await queryInterface.addColumn('cities', 'visible', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE cities SET visible = 't'"
  );

  await queryInterface.changeColumn('cities', 'visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });

  await queryInterface.addColumn('districts', 'visible', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE districts SET visible = 't'"
  );

  await queryInterface.changeColumn('districts', 'visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });

  await queryInterface.addColumn('equipment', 'visible', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET visible = 't'"
  );

  await queryInterface.changeColumn('equipment', 'visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });

  await queryInterface.addColumn('memberships', 'visible', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE memberships SET visible = 't'"
  );

  await queryInterface.changeColumn('memberships', 'visible', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gyms', 'visible');
  await queryInterface.removeColumn('cities', 'visible');
  await queryInterface.removeColumn('districts', 'visible');
  await queryInterface.removeColumn('equipment', 'visible');
  await queryInterface.removeColumn('memberships', 'visible');
};

export { up, down };
