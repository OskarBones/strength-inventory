import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('gymequipment', {
    id: {
      type: DataTypes.UUID,  // CHAR(36) for MySQL
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    gymId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'gyms', key: 'id' }
    },
    equipmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'equipment', key: 'id' }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('gymequipment');
};

export { up, down };
