import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('gyms', 'chain', {
    type: DataTypes.STRING
  });

  await queryInterface.changeColumn('gyms', 'url', {
    type: DataTypes.STRING
  });

  await queryInterface.changeColumn('gyms', 'notes', {
    type: DataTypes.STRING
  });

  await queryInterface.changeColumn('equipment', 'available_weights', {
    type: DataTypes.JSON,
    defaultValue: []
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET url = NULL where url = ''"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET notes = NULL where notes = ''"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE memberships SET chain = NULL where chain = ''"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE memberships SET country = NULL where country = ''"
  );

  await queryInterface.changeColumn('memberships', 'availability', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      Desk: false,
      Web: false,
      App: false,
      Other: false
    }
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE memberships SET url = NULL where url = ''"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE memberships SET notes = NULL where notes = ''"
  );
};


const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('gyms', 'chain', {
    type: DataTypes.STRING,
    defaultValue: null
  });

  await queryInterface.changeColumn('gyms', 'url', {
    type: DataTypes.STRING,
    defaultValue: null
  });

  await queryInterface.changeColumn('gyms', 'notes', {
    type: DataTypes.STRING,
    defaultValue: null
  });

  await queryInterface.changeColumn('equipment', 'available_weights', {
    type: DataTypes.JSON
  });

  await queryInterface.changeColumn('memberships', 'availability', {
    type: DataTypes.JSON,
    allowNull: false
  });
};

export { up, down };
