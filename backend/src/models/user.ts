/* eslint-disable @stylistic/lines-between-class-members */
import {
  type BelongsToManyGetAssociationsMixin,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model
} from 'sequelize';

import type { UserRole } from '@strength-inventory/schemas';

import { sequelize } from '../utils/db.js';

import { Gym } from './index.ts';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare emailVerified: CreationOptional<boolean>;
  declare passwordHash: string;
  declare name: string;
  declare role: CreationOptional<UserRole>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getGyms: BelongsToManyGetAssociationsMixin<Gym>;
}

import { STRING_DEFAULT_LEN, USER_ROLES, USERNAME_MAX_LEN, USERS_NAME_MAX_LEN }
  from '@strength-inventory/schemas';

User.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [1, USERNAME_MAX_LEN]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, USERS_NAME_MAX_LEN]
    }
  },
  role: {
    type: DataTypes.ENUM(...USER_ROLES),
    allowNull: false,
    defaultValue: 'GYM-GOER',
    validate: {
      isIn: [USER_ROLES]
    }
  },
  createdAt: DataTypes.DATE,  // automatically managed by Sequelize
  updatedAt: DataTypes.DATE  // automatically managed by Sequelize
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
});

export default User;
