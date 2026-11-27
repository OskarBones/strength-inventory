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
  ACCESSORIES_AND_TOOLS,
  BARS_AND_PLATES,
  CARDIO,
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_MAXIMUM_WEIGHT_TYPES,
  EQUIPMENT_WEIGHT_UNITS,
  type EquipmentCategory,
  type EquipmentMaximumWeightType,
  type EquipmentWeightUnit,
  FREE_WEIGHTS,
  HANDLE_ATTACHMENTS,
  MAX_WEIGHT,
  STRENGTH_MACHINES,
  STRING_DEFAULT_LEN,
  SYSTEMS
} from '@strength-inventory/schemas';

import { sequelize } from '../utils/db.js';

import { Gym } from './index.ts';

class Equipment extends Model<
  InferAttributes<Equipment>,
  InferCreationAttributes<Equipment>
> {
  declare id: CreationOptional<string>;
  declare visible: CreationOptional<boolean>;
  declare name: string;
  declare generic: boolean;
  declare category: EquipmentCategory;
  declare subcategory: string;
  declare manufacturer: string;
  declare code: string;
  declare weightUnit: EquipmentWeightUnit | null;
  declare weight: number | null;
  declare startingWeight: number | null;
  declare availableWeights: CreationOptional<number[]>;
  declare maximumWeight: number | null;
  declare maximumWeightType: CreationOptional<EquipmentMaximumWeightType>;
  declare outOfProduction: boolean;
  declare url: string | null;
  declare notes: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getGyms: BelongsToManyGetAssociationsMixin<Gym>;
}

Equipment.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  generic: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  category: {
    type: DataTypes
      .ENUM(...EQUIPMENT_CATEGORIES),
    allowNull: false,
    validate: {
      isIn: [EQUIPMENT_CATEGORIES]
    }
  },
  /* at the db level, subcategory is only enforced as a string
  instead of an enum because the set of accepted subcategories
  is subject to many small changes in the future */
  subcategory: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'other',
    validate: {
      notEmpty: true
    }
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, STRING_DEFAULT_LEN]
    }
  },
  weightUnit: {
    type: DataTypes.ENUM(...EQUIPMENT_WEIGHT_UNITS),
    validate: {
      isIn: [EQUIPMENT_WEIGHT_UNITS]
    }
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    // as per customValidator(), using this field requires weightUnit !== null
    validate: {
      max: MAX_WEIGHT,
      min: 0.01
    }
  },
  startingWeight: {
    type: DataTypes.DECIMAL(5, 2),
    // as per customValidator(), using this field requires weightUnit !== null
    validate: {
      max: MAX_WEIGHT,
      min: 0.01
    }
  },
  availableWeights: {
    type: DataTypes.JSON,
    // as per customValidator(), using this field requires weightUnit !== null
    defaultValue: []
  },
  maximumWeight: {
    type: DataTypes.DECIMAL(5, 2),
    // as per customValidator(), using this field requires weightUnit !== null
    validate: {
      max: MAX_WEIGHT,
      min: 0.01
    }
  },
  maximumWeightType: {
    type: DataTypes.ENUM(...EQUIPMENT_MAXIMUM_WEIGHT_TYPES),
    validate: {
      isIn: [EQUIPMENT_MAXIMUM_WEIGHT_TYPES]
    }
  },
  outOfProduction: {
    type: DataTypes.BOOLEAN
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
  modelName: 'equipment',
  validate: {
    customValidator () {
      const instance = this as unknown as Equipment;

      /* This switch needs to be updated manually if categories are changed.
      There is a reminder about this above EQIUPMENT_CATEGORIES definition. */
      const subcategoryError = 'invalid subcategory';
      const category = instance.category;
      const subcategory = instance.subcategory;
      switch (category) {
        case 'accessoryOrTool':
          if (!(ACCESSORIES_AND_TOOLS.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        case 'barOrPlate':
          if (!(BARS_AND_PLATES.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        case 'cardio':
          if (!(CARDIO.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        case 'freeWeight':
          if (!(FREE_WEIGHTS.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        case 'handleAttachment':
          if (!(HANDLE_ATTACHMENTS.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        case 'strengthMachine':
          if (!(STRENGTH_MACHINES.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        case 'system':
          if (!(SYSTEMS.includes(subcategory))) {
            throw new HttpError(subcategoryError, 400);
          }
          break;
        default:
          throw new HttpError('invalid category', 400);
      }

      if (!instance.weightUnit && (
        instance.weight
        || instance.startingWeight
        || instance.availableWeights.length > 0
        || instance.maximumWeight
      )) {
        throw new HttpError(
          'weight unit must be selected if other weight data is used',
          400
        );
      }

      if ((instance.startingWeight && instance.maximumWeight)
        && instance.startingWeight > instance.maximumWeight) {
        throw new HttpError(
          'starting weight cannot be more than maximum weight',
          400
        );
      }

      if ((instance.availableWeights.length > 0 && instance.startingWeight)
        && Math.min(...instance.availableWeights) !== instance.startingWeight) {
        throw new HttpError(
          'smallest available weight must equal starting weight',
          400
        );
      }

      if ((instance.availableWeights.length > 0 && instance.maximumWeight)
        && Math.max(...instance.availableWeights) !== instance.maximumWeight) {
        throw new HttpError(
          'highest available weight must equal maximum weight',
          400
        );
      }
    }
  }
});

export default Equipment;
