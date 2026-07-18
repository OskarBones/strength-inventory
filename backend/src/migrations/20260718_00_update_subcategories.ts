/* eslint-disable @stylistic/max-len */
/* eslint-disable @stylistic/quotes */
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'hip abduction' WHERE subcategory = 'outer thigh machine'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'hip adduction' WHERE subcategory = 'inner thigh machine'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'plyo box' WHERE subcategory = 'plyobox'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'squat' WHERE subcategory = 'hack squat'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'incline biceps curl' WHERE subcategory = 'preacher curl'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'dip' WHERE subcategory = 'assisted dip'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'pull-up' WHERE subcategory = 'assisted pull-up'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'dip + pull-up' WHERE subcategory = 'assisted dip + pull-up'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'torso rotation' WHERE subcategory = 'rotary torso'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'core bench' WHERE subcategory = 'decline bench' OR subcategory = 'captain''s chair'"
  );
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'outer thigh machine' WHERE subcategory = 'hip abduction'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'inner thigh machine' WHERE subcategory = 'hip adduction'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'plyobox' WHERE subcategory = 'plyo box'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'hack squat' WHERE subcategory = 'squat'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'incline biceps curl' WHERE subcategory = 'preacher curl'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'assisted dip' WHERE subcategory = 'dip'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'assisted pull-up' WHERE subcategory = 'pull-up'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'assisted dip + pull-up' WHERE subcategory = 'dip + pull-up'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'rotary torso' WHERE subcategory = 'torso rotation'"
  );

  // NOTE: All captain's chairs become decline benches!
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'decline bench' WHERE subcategory = 'core bench'"
  );
};

export { up, down };
