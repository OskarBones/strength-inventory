/* eslint-disable @stylistic/lines-between-class-members */
import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model
} from 'sequelize';

import { sequelize } from '../utils/db.ts';

class GymMemberships extends Model<
  InferAttributes<GymMemberships>, InferCreationAttributes<GymMemberships>
> {
  declare id: CreationOptional<string>;
  declare gymId: string;
  declare membershipId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

GymMemberships.init({
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
  membershipId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'memberships', key: 'id' },
    onDelete: 'CASCADE',
    validate: {
      isUUID: 4
    }
  },
  createdAt: DataTypes.DATE,  // automatically managed by Sequelize
  updatedAt: DataTypes.DATE  // automatically managed by Sequelize
}, {
  sequelize,
  underscored: true,
  modelName: 'gymmemberships'
});

export default GymMemberships;
