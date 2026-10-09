/* eslint-disable @stylistic/lines-between-class-members */
import {
  type BelongsToManyGetAssociationsMixin,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model
} from 'sequelize';

import HttpError from '../utils/HttpError.ts';

import {
  COUNTRY_MAX_LEN,
  CURRENCIES,
  MEMBERSHIP_TIME_UNITS,
  type MembershipAvailability,
  type MembershipTimeUnit,
  STRING_DEFAULT_LEN
} from '@strength-inventory/schemas';

import { sequelize } from '../utils/db.js';

import { Gym } from './index.ts';

class Membership extends Model<
  InferAttributes<Membership>, InferCreationAttributes<Membership>
> {
  declare id: CreationOptional<string>;
  declare chain: string | null;
  declare country: string | null;
  declare name: string;
  declare initiationFee: number | null;
  declare membershipFee: number;
  declare feeCurrency: string;
  declare visits: number | null;
  declare validity: number;
  declare validityUnit: MembershipTimeUnit;
  declare commitment: number | null;
  declare commitmentUnit: MembershipTimeUnit | null;
  declare autoRenewal: boolean;
  declare availability: CreationOptional<MembershipAvailability>;
  declare url: string | null;
  declare notes: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getGyms: BelongsToManyGetAssociationsMixin<Gym>;
}

Membership.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  chain: {
    type: DataTypes.STRING,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  country: {
    type: DataTypes.STRING,
    validate: {
      len: [1, COUNTRY_MAX_LEN]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  initiationFee: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      isDecimal: true
    }
  },
  membershipFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true
    }
  },
  /* at the db level, feeCurrency is only enforced as a string
  instead of an enum because the set of accepted currencies
  is set to grow in the future */
  feeCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [CURRENCIES],
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  visits: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },
  validity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  validityUnit: {
    type: DataTypes.ENUM(...MEMBERSHIP_TIME_UNITS),
    allowNull: false,
    validate: {
      isIn: [MEMBERSHIP_TIME_UNITS]
    }
  },
  commitment: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },
  commitmentUnit: {
    type: DataTypes.ENUM(...MEMBERSHIP_TIME_UNITS),
    // as per customValidator(), this field is required if commitment !== null
    validate: {
      isIn: [MEMBERSHIP_TIME_UNITS]
    }
  },
  autoRenewal: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  availability: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      Desk: false,
      Web: false,
      App: false,
      Other: false
    }
  },
  url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  notes: {
    type: DataTypes.STRING,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  createdAt: DataTypes.DATE,  // automatically managed by Sequelize
  updatedAt: DataTypes.DATE  // automatically managed by Sequelize
}, {
  sequelize,
  underscored: true,
  modelName: 'membership',
  validate: {
    customValidator () {
      const instance = this as unknown as Membership;

      if ((instance.chain && !instance.country)
        || (instance.country && !instance.chain)
      ) {
        throw new HttpError(
          'chain and country must both be given or left empty',
          400
        );
      }

      if (!instance.commitmentUnit && instance.commitment) {
        throw new HttpError(
          'commitment unit must be selected if there is commitment',
          400
        );
      }
    }
  }
});

export default Membership;
