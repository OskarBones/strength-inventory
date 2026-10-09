/* eslint-disable @stylistic/lines-between-class-members */
import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model
} from 'sequelize';

import { sequelize } from '../utils/db.ts';

class Session extends Model<
  InferAttributes<Session>, InferCreationAttributes<Session>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare accessToken: string;
  declare refreshToken: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Session.init({
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
    validate: {
      isUUID: 4
    }
  },
  accessToken: {
    type: DataTypes.STRING(510),
    allowNull: false,
    validate: {
      len: [1, 510]
    }
  },
  refreshToken: {
    type: DataTypes.STRING(510),
    allowNull: false,
    validate: {
      len: [1, 510]
    }
  },
  createdAt: DataTypes.DATE,  // automatically managed by Sequelize
  updatedAt: DataTypes.DATE  // automatically managed by Sequelize
}, {
  sequelize,
  underscored: true,
  modelName: 'session'
});

export default Session;
