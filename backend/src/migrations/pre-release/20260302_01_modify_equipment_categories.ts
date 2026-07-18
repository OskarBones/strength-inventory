import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
    "CREATE TYPE enum_equipment_category_new AS ENUM('accessoryOrTool', 'cardio', 'freeWeight', 'handleAttachment', 'strengthMachine', 'system')"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
    "ALTER TYPE enum_equipment_category ADD VAlUE IF NOT EXISTS 'handleAttachment'"
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
    "ALTER TYPE enum_equipment_category ADD VALUE IF NOT EXISTS 'accessoryOrTool'"
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "ALTER TYPE enum_equipment_category ADD VALUE IF NOT EXISTS 'system'"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes, @stylistic/max-len
    "UPDATE equipment SET category = 'handleAttachment' WHERE category = 'attachment'"
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET category = 'accessoryOrTool' WHERE category = 'tool'"
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

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
    "CREATE TYPE enum_equipment_category_new AS ENUM('attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool')"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "ALTER TYPE enum_equipment_category ADD VALUE IF NOT EXISTS 'attachment'"
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "ALTER TYPE enum_equipment_category ADD VALUE IF NOT EXISTS 'tool'"
  );

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes, @stylistic/max-len
    "UPDATE equipment SET category = 'attachment' WHERE category = 'handleAttachment'"
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET category = 'tool' WHERE category = 'accessoryOrTool'"
  );
  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes
    "UPDATE equipment SET category = 'tool' WHERE category = 'system'"
  );

  // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
  await queryInterface.sequelize.query("ALTER TABLE equipment ALTER COLUMN category TYPE enum_equipment_category_new USING (category::text::enum_equipment_category_new)");

  // eslint-disable-next-line @stylistic/quotes
  await queryInterface.sequelize.query("DROP TYPE enum_equipment_category");

  // eslint-disable-next-line @stylistic/max-len, @stylistic/quotes
  await queryInterface.sequelize.query("ALTER TYPE enum_equipment_category_new RENAME TO enum_equipment_category");

  await queryInterface.changeColumn('equipment', 'category', {
    type: DataTypes
      .ENUM('attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool'),
    allowNull: false
  });
};

export { up, down };
