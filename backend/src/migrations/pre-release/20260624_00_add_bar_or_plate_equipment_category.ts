import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "ALTER TYPE enum_equipment_category ADD VALUE IF NOT EXISTS 'barOrPlate'"
  );

  await queryInterface.changeColumn('equipment', 'category', {
    type: DataTypes
      .ENUM(
        'accessoryOrTool',
        'barOrPlate',
        'cardio',
        'freeWeight',
        'handleAttachment',
        'strengthMachine',
        'system'
      ),
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
    "CREATE TYPE enum_equipment_category_new AS ENUM('accessoryOrTool', 'cardio', 'freeWeight', 'handleAttachment', 'strengthMachine', 'system')"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET category = 'freeWeight' WHERE category = 'barOrPlate'"
  );

  // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
  await queryInterface.sequelize.query("ALTER TABLE equipment ALTER COLUMN category TYPE enum_equipment_category_new USING (category::text::enum_equipment_category_new)");

  // eslint-disable-next-line @stylistic/quotes
  await queryInterface.sequelize.query("DROP TYPE enum_equipment_category");

  // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
  await queryInterface.sequelize.query("ALTER TYPE enum_equipment_category_new RENAME TO enum_equipment_category");

  await queryInterface.changeColumn('equipment', 'category', {
    type: DataTypes
      .ENUM(
        'accessoryOrTool',
        'cardio',
        'freeWeight',
        'handleAttachment',
        'strengthMachine',
        'system'
      ),
    allowNull: false
  });
};

export { up, down };
