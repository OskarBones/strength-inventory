/* eslint-disable @stylistic/lines-between-class-members */
import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model
} from 'sequelize';

import { adjustUserRole } from '../utils/middleware.ts';

import { sequelize } from '../utils/db.js';

import User from './user.ts';

class GymManagers extends Model<
  InferAttributes<GymManagers>, InferCreationAttributes<GymManagers>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare gymId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

GymManagers.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
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
  createdAt: DataTypes.DATE,  // automatically managed by Sequelize
  updatedAt: DataTypes.DATE  // automatically managed by Sequelize
}, {
  hooks: {
    afterCreate: async (gymmanager) => {  // Turn gym-goers into managers.
      const manager = await User.findByPk(gymmanager.userId);
      if (manager) {
        if (manager.role !== 'ADMIN' && manager.role !== 'SUPERUSER') {
          await manager.update({
            role: 'MANAGER'
          });
        }
      }
    },
    afterDestroy: async (gymmanager) => {
      await adjustUserRole(gymmanager.userId, 0);
    }  // Turn gym-less managers into gym-goers.
  },
  sequelize,
  underscored: true,
  modelName: 'gymmanagers'
});

export default GymManagers;
