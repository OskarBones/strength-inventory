/* eslint-disable @stylistic/max-len */
/* eslint-disable @stylistic/quotes */
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'training stick' WHERE subcategory = 'exercise stick'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'fixed barbell' WHERE subcategory = 'barbell'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'wearable strap / wrap / grip' WHERE subcategory = 'lifting strap'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'ab wheel' WHERE subcategory = 'ab roller'"
  );
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'exercise stick' WHERE subcategory = 'training stick'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'barbell' WHERE subcategory = 'fixed barbell'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'lifting strap' WHERE subcategory = 'wearable strap / wrap / grip'"
  );

  await queryInterface.sequelize.query(
    "UPDATE equipment SET subcategory = 'ab roller' WHERE subcategory = 'ab wheel'"
  );
};

export { up, down };
