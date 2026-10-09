/* eslint-disable @stylistic/lines-between-class-members */
import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model
} from 'sequelize';

import { sequelize } from '../utils/db.js';

class GymEquipment extends Model<
  InferAttributes<GymEquipment>, InferCreationAttributes<GymEquipment>
> {
  declare id: CreationOptional<string>;
  declare gymId: string;
  declare equipmentId: string;
  declare count: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

GymEquipment.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  gymId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' },
    onDelete: 'CASCADE',
    validate: {
      isUUID: 4
    }
  },
  equipmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'equipment', key: 'id' },
    onDelete: 'CASCADE',
    validate: {
      isUUID: 4
    }
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  createdAt: DataTypes.DATE,  // automatically managed by Sequelize
  updatedAt: DataTypes.DATE  // automatically managed by Sequelize
}, {
  sequelize,
  underscored: true,
  modelName: 'gymequipment',
  tableName: 'gymequipment'
});

export default GymEquipment;
