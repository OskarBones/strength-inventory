/* eslint-disable @stylistic/max-len */
/* eslint-disable @stylistic/quotes */
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'abs bench' WHERE subcategory = 'core bench'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'curved bar' WHERE subcategory = 'EZ pulldown bar'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'resistance band/tube' WHERE subcategory = 'resistance band'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = '20 kg barbell' WHERE subcategory = '20 kg bar'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = '15 kg barbell' WHERE subcategory = '15 kg bar'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = '10 kg barbell' WHERE subcategory = '10 kg bar'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'push-up grip pair' WHERE subcategory = 'push-up handle pair'"
  );
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'core bench' WHERE subcategory = 'abs bench'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'EZ pulldown bar' WHERE subcategory = 'curved bar'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'resistance band' WHERE subcategory = 'resistance band/tube'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = '20 kg bar' WHERE subcategory = '20 kg barbell'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = '15 kg bar' WHERE subcategory = '15 kg barbell'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = '10 kg bar' WHERE subcategory = '10 kg barbell'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'push-up handle pair' WHERE subcategory = 'push-up grip pair'"
  );
};

export { up, down };
