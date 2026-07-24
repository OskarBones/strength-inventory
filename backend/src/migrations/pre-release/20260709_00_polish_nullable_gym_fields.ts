import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE gyms SET chain = NULL where chain = ''"
  );

  await queryInterface.changeColumn('gyms', 'chain', {
    type: DataTypes.STRING,
    defaultValue: null
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes, @stylistic/max-len
    `UPDATE gyms SET opening_hours_everyone = '{"MO": [null, null], "TU": [null, null], "WE": [null, null], "TH": [null, null], "FR": [null, null], "SA": [null, null], "SU": [null, null]}' WHERE opening_hours_everyone::text = '{}'`
  );

  await queryInterface.changeColumn('gyms', 'opening_hours_everyone', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      MO: [null, null],
      TU: [null, null],
      WE: [null, null],
      TH: [null, null],
      FR: [null, null],
      SA: [null, null],
      SU: [null, null]
    }
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes, @stylistic/max-len
    `UPDATE gyms SET opening_hours_members = '{"MO": [null, null], "TU": [null, null], "WE": [null, null], "TH": [null, null], "FR": [null, null], "SA": [null, null], "SU": [null, null]}' WHERE opening_hours_members::text = '{}'`
  );


  await queryInterface.changeColumn('gyms', 'opening_hours_members', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      MO: [null, null],
      TU: [null, null],
      WE: [null, null],
      TH: [null, null],
      FR: [null, null],
      SA: [null, null],
      SU: [null, null]
    }
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes, @stylistic/max-len
    `UPDATE gyms SET opening_hours_exceptions = '{ "data": [] }' WHERE opening_hours_exceptions::text = '{}'`
  );

  await queryInterface.changeColumn('gyms', 'opening_hours_exceptions', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: { data: [] }
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE gyms SET url = NULL where url = ''"
  );

  await queryInterface.changeColumn('gyms', 'url', {
    type: DataTypes.STRING,
    defaultValue: null
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE gyms SET notes = NULL where notes = ''"
  );

  await queryInterface.changeColumn('gyms', 'notes', {
    type: DataTypes.STRING,
    defaultValue: null
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('gyms', 'chain', {
    type: DataTypes.STRING
  });

  await queryInterface.changeColumn('gyms', 'opening_hours_everyone', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });

  await queryInterface.changeColumn('gyms', 'opening_hours_members', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });

  await queryInterface.changeColumn('gyms', 'opening_hours_exceptions', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  });

  await queryInterface.changeColumn('gyms', 'url', {
    type: DataTypes.STRING
  });

  await queryInterface.changeColumn('gyms', 'notes', {
    type: DataTypes.STRING
  });
};

export { up, down };
