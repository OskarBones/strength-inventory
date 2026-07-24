import { z } from 'zod';

/* NOTE ABOUT STRINGS
z.string().min(1) = required string
z.string() = optional string i.e. empty strings accepted */


// shared utility schemas

const TimeSchema = z.array(z.iso.time().nullable()).length(2);
const ExceptionTimeSchema = z.array(z.iso.time().nullish()).length(2);

export const HoursSchema = z.object({
  MO: TimeSchema,
  TU: TimeSchema,
  WE: TimeSchema,
  TH: TimeSchema,
  FR: TimeSchema,
  SA: TimeSchema,
  SU: TimeSchema
});
export type Hours = z.infer<typeof HoursSchema>;  // used in gym and membership

// used in gym, city and district
const LatitudeSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return Number(Number.parseFloat(val).toFixed(5))
  }
  return val;
}, z.number().gte(-90).lte(90))
const LongitudeSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return Number(Number.parseFloat(val).toFixed(5))
  }
  return val;
}, z.number().gte(-90).lte(90))

// used in gym and city
export const COUNTRY_MAX_LEN = 40
const CountrySchema = z.string().min(1).max(COUNTRY_MAX_LEN)

// used in gym, city and district
export const LOCATION_MAX_LEN = 60
const SubLocationNameSchema = z.string().min(1).max(LOCATION_MAX_LEN)


// membership

export const MembershipTimeUnitEnum = z.enum(['year', 'month', 'week', 'day', 'hour']);
export type MembershipTimeUnit = z.infer<typeof MembershipTimeUnitEnum>;

export const MembershipAvailabilitySchema = z.object({
  Desk: z.boolean(),
  Web: z.boolean(),
  App: z.boolean(),
  Other: z.boolean()
})
export type MembershipAvailability = z.infer<typeof MembershipAvailabilitySchema>;

const MembershipBaseSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1),
  initiationFee: z.preprocess((val) => {
    return(Number(val))
  }, z.number().nullish()),
  membershipFee: z.preprocess((val) => {
    return(Number(val))
  }, z.number()),
  feeCurrency: z.string().min(1),
  visits: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number(val)
      } else {
        return null
      }
    }
    return val;
  }, z.int().nullable()),
  validity: z.preprocess((val) => {
    return(Number(val))
  }, z.int()),
  validityUnit: MembershipTimeUnitEnum,
  autoRenewal: z.boolean(),
  availability: MembershipAvailabilitySchema,
  url: z.preprocess(
    (val) => (val === '' ? null : val),
    z.url().nullish()
  ),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

const MembershipWithChainSchema = z.object({
  chain: z.string().min(1),
  country: z.string().min(1).max(40)
})

const MembershipWithoutChainSchema = z.object({
  chain: z.literal(''),
  country: z.literal('')
})

const MembershipChainSchema = z.union([
  MembershipWithChainSchema, MembershipWithoutChainSchema
])

const MembershipWithCommitmentSchema = z.object({
  commitmentUnit: MembershipTimeUnitEnum,
  commitment: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseInt(val)
      } else {
        return null
      }
    }
    return val;
  }, z.int())
})

const MembershipWithoutCommitmentSchema = z.object({
  commitmentUnit: z.null(),
  commitment: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseInt(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a commitment unit to add commitment'))
})

const MembershipCommitmentSchema = z.discriminatedUnion('commitmentUnit', [
  MembershipWithCommitmentSchema, MembershipWithoutCommitmentSchema
])

const MembershipUnions = z.intersection(MembershipChainSchema, MembershipCommitmentSchema)

export const MembershipSchema = z.intersection(MembershipBaseSchema, MembershipUnions)
export type Membership = z.infer<typeof MembershipSchema>;

export const MembershipPostAndPutSchema = z.intersection(
    MembershipBaseSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    MembershipUnions)
export type MembershipPostAndPut = z.infer<typeof MembershipPostAndPutSchema>;


// gymmanagers

export const GymManagerSchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  gymId: z.uuidv4(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type GymManager = z.infer<typeof GymManagerSchema>;

export const GymManagerPostSchema = GymManagerSchema.pick({
  userId: true,
  gymId: true
});
export type GymManagerPost = z.infer<typeof GymManagerPostSchema>;


// user

export const PasswordSchema = z
  .string()
  .min(15)  // without MFA, shorter than 15 is considered weak (NIST SP800-63B)
  .max(100);  // upper limit prevents extremely long passwords that would take too long to hash (NIST SP800-63B)

export const UserRoleEnum = z.enum(['SUPERUSER', 'ADMIN', 'MANAGER', 'GYM-GOER']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const USERNAME_MAX_LEN = 30
export const USERS_NAME_MAX_LEN = 100
export const UserSchema = z.object({
  id: z.uuidv4(),
  username: z.string().min(1).max(USERNAME_MAX_LEN),
  email: z.email(),
  emailVerified: z.boolean(),
  passwordHash: z.string().min(1),
  name: z.string().min(1).max(USERS_NAME_MAX_LEN),
  role: UserRoleEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type User = z.infer<typeof UserSchema>;

export const UserPostSchema = UserSchema.pick({
  username: true,
  email: true,
  name: true
}).extend({
  password: PasswordSchema
});
export type UserPost = z.infer<typeof UserPostSchema>;

export const UserPutSchema = UserSchema.pick({
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true
}).extend({
  password: PasswordSchema.optional()
});
export type UserPut = z.infer<typeof UserPutSchema>;

export const UserTokenPayloadSchema = UserSchema.pick({
  id: true,
  username: true
}).extend({
  userContext: z.string().min(1)
});
export type UserTokenPayload = z.infer<typeof UserTokenPayloadSchema>;

export const UserNamesSchema = UserSchema.pick({
  username: true,
  name: true
});

export const UserFrontendQuerySchema = UserSchema.pick({
  id: true,
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true
})
export const UserFrontendSchema = UserFrontendQuerySchema.nullish()
export type UserFrontend = z.infer<typeof UserFrontendSchema>


// equipment

export const EquipmentCategoryEnum = z.enum(['accessoryOrTool', 'barOrPlate', 'cardio', 'freeWeight', 'handleAttachment', 'strengthMachine', 'system']);
export type EquipmentCategory = z.infer<typeof EquipmentCategoryEnum>;

/* NOTE: the word 'plate' shall only be used in BARS_AND_PLATES
subcategories for loadable plates, because the frontend does
piece.subcategory.includes('plate') to identify them */

export const SYSTEMS = [
  'rack or rig',
  'adjustable crossover cable station',
  'high/low crossover cable station',
  'high/low duplex cable station',
  'adjustable cable station',
  'high cable station',
  'low cable station',
  'smith machine',
  'split squat stand',
  'flat bench press',
  'incline bench press',
  'decline bench press',
  'shoulder press bench',
  'adjustable bench',
  'fixed bench',
  'incline biceps curl',
  'rowing cable station',
  'pulldown cable station',
  'seal row',
  'landmine',
  'dip station',
  'hip thrust pad',
  'back extension',
  'abs bench',
  'stall bars',
  'safety arm',
  'platform',
  'other'
];
export const SystemCategorySchema = z.enum(SYSTEMS)
export type SystemCategory = z.infer<typeof SystemCategorySchema>

export const BARS_AND_PLATES = [
  '25 kg barbell',
  '20 kg barbell',
  '15 kg barbell',
  '10 kg barbell',
  'trap bar',
  'safety squat bar',
  'swiss bar',
  'other barbell',
  'EZ bar',
  'tricep bar',
  'strongman log',
  'barbell rowing handle',
  'deadlift jack',
  'barbell pad',
  'collar pair',
  'other',
  '50 kg plate',
  '40 kg plate',
  '25 kg plate',
  '20 kg plate',
  '15 kg plate',
  '10 kg plate',
  '5 kg plate',
  '2.5 kg plate',
  '2 kg plate',
  '1.5 kg plate',
  '1.25 kg plate',
  '1 kg plate',
  '0.5 kg plate',
  '0.25 kg plate'
];
export const BarOrPlateCategorySchema = z.enum(BARS_AND_PLATES)
export type BarOrPlateCategory = z.infer<typeof BarOrPlateCategorySchema>

export const FREE_WEIGHTS = [
  'dumbbell',
  'fixed barbell',
  'kettlebell',
  'sandbag',
  'other'
];
export const FreeWeightCategorySchema = z.enum(FREE_WEIGHTS)
export type FreeWeightCategory = z.infer<typeof FreeWeightCategorySchema>

export const HANDLE_ATTACHMENTS = [
  'stirrup handle',
  'rope',
  'rowing handle',
  'pulldown bar',
  'curved bar',
  'arms handle',
  'ab crunch handle',
  'arm strap',
  'ankle strap',
  'other'
];
export const HandleAttachmentCategorySchema = z.enum(HANDLE_ATTACHMENTS)
export type handleAttachmentCategory = z.infer<typeof HandleAttachmentCategorySchema>

export const STRENGTH_MACHINES = [
  'squat',
  'leg press',
  'glute machine',
  'leg extension + leg curl',
  'leg extension',
  'leg curl',
  'dip + pull-up',
  'dip',
  'pull-up',
  'row',
  'pulldown',
  'pullover',
  'rear delts machine + pec deck',
  'rear delts machine',
  'pec deck',
  'chest press',
  'shoulder press',
  'lateral raise',
  'tricep extension',
  'biceps curl',
  'abdominal crunch + back extension',
  'abdominal crunch',
  'back extension',
  'torso rotation',
  'calf machine',
  'forearm machine',
  'hip abduction + hip adduction',
  'hip abduction',
  'hip adduction',
  'weight stack add on',
  'other'
];
export const StrengthMachineCategorySchema = z.enum(STRENGTH_MACHINES)
export type StrengthMachineCategory = z.infer<typeof StrengthMachineCategorySchema>

export const ACCESSORIES_AND_TOOLS = [
  'step platform',
  'plyo box',
  'lifting belt',
  'dip belt',
  'powerlifting mat',
  'squat ramp',
  'wearable strap / wrap / grip',
  'suspension strap',
  'hanging strap',
  'bar grip',
  'training stick',
  'exercise mat',
  'ab wheel',
  'ab mat',
  'resistance band/tube',
  'roller or arch',
  'inflated ball',
  'medicine ball',
  'yoga block',
  'jump rope',
  'balance trainer',
  'push-up grip pair',
  'hand gripper',
  'head harness',
  'sled strap',
  'boxing gloves',
  'gymnastics equipment',
  'other'
];
export const AccessoryOrToolCategorySchema = z.enum(ACCESSORIES_AND_TOOLS)
export type AccessoryOrToolCategory = z.infer<typeof AccessoryOrToolCategorySchema>

export const CARDIO = [
  'stair climbing machine',
  'spin bike',
  'upright bike',
  'recumbent bike',
  'elliptical',
  'rower',
  'treadmill',
  'skiing machine',
  'stepper',
  'punching bag',
  'other'
];
export const CardioCategorySchema = z.enum(CARDIO)
export type CardioCategory = z.infer<typeof CardioCategorySchema>

export const EquipmentWeightUnitEnum = z.enum(['kg', 'lbs'])
export type EquipmentWeightUnit = z.infer<typeof EquipmentWeightUnitEnum>;

export const EquipmentMaximumWeightTypeEnum = z.enum(['load', 'weight'])
export type EquipmentMaximumWeightType = z.infer<typeof EquipmentMaximumWeightTypeEnum>;

const EquipmentBaseSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1),
  manufacturer: z.string().min(1),
  code: z.string().min(1),
  maximumWeightType: EquipmentMaximumWeightTypeEnum,
  outOfProduction: z.boolean(),
  url: z.preprocess(
    (val) => (val === '' ? null : val),
    z.url().nullish()
  ),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

// global variable that corresponds to defined database limitations
export const MAX_WEIGHT: number = 999;

const SystemSchema = z.object({
  category: z.literal('system'),
  subcategory: SystemCategorySchema
})

const BarOrPlateSchema = z.object({
  category: z.literal('barOrPlate'),
  subcategory: BarOrPlateCategorySchema
})

const FreeWeightSchema = z.object({
  category: z.literal('freeWeight'),
  subcategory: FreeWeightCategorySchema
})

const HandleAttachmentSchema = z.object({
  category: z.literal('handleAttachment'),
  subcategory: HandleAttachmentCategorySchema
})

const StrengthMachineSchema = z.object({
  category: z.literal('strengthMachine'),
  subcategory: StrengthMachineCategorySchema
})

const AccessoryOrToolSchema = z.object({
  category: z.literal('accessoryOrTool'),
  subcategory: AccessoryOrToolCategorySchema
})

const CardioSchema = z.object({
  category: z.literal('cardio'),
  subcategory: CardioCategorySchema
})

const EquipmentCategorySchema = z.discriminatedUnion('category', [
  SystemSchema,
  BarOrPlateSchema,
  FreeWeightSchema,
  HandleAttachmentSchema,
  StrengthMachineSchema,
  AccessoryOrToolSchema,
  CardioSchema
])

const WeightSchema = z.float32().positive().lte(MAX_WEIGHT)

const EquipmentWithWeightsSchema = z.object({
  weightUnit: EquipmentWeightUnitEnum,
  weight: z.preprocess((val) => {
    if (!val) {
      return null
    }
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, WeightSchema.nullish()),
  startingWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, WeightSchema.nullish()),
  availableWeights: z.array(WeightSchema),
  maximumWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, WeightSchema.nullish()),
})
.refine((data) => {
  if (data.startingWeight && data.maximumWeight) {
    return data.startingWeight < data.maximumWeight
  } else {
    return true;
  }
}, { error: 'starting weight cannot be more than maximum weight' })
.refine((data) => {
  if (data.availableWeights.length > 0 && data.startingWeight) {
    return Math.min(...data.availableWeights) === data.startingWeight
  } else {
    return true
  }
}, { error: 'smallest available weight must equal starting weight' })
.refine((data) => {
  if (data.availableWeights.length > 0 && data.maximumWeight) {
    return Math.max(...data.availableWeights) === data.maximumWeight
  } else {
    return true
  }
}, { error: 'highest available weight must equal maximum weight' })

const EquipmentWithoutWeightsSchema = z.object({
  weightUnit: z.null(),
  weight: z.preprocess((val) => {
    if (!val) {
      return null
    }
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a weight unit to use weights')),
  startingWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a weight unit to use weights')),
  availableWeights: z.array(z.float32()).length(0, 'select a weight unit to use weights'),
  maximumWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a weight unit to use weights'))
})

const EquipmentWeightsSchema = z.discriminatedUnion('weightUnit', [
  EquipmentWithWeightsSchema, EquipmentWithoutWeightsSchema
])

const EquipmentUnions = z.intersection(EquipmentCategorySchema, EquipmentWeightsSchema)

export const EquipmentSchema = z.intersection(EquipmentBaseSchema, EquipmentUnions)
export type Equipment = z.infer<typeof EquipmentSchema>;

export const EquipmentPostAndPutSchema = z.intersection(
  EquipmentBaseSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  EquipmentUnions)
export type EquipmentPostAndPut = z.infer<typeof EquipmentPostAndPutSchema>;


// gymequipment

export const GymEquipmentSchema = z.object({
  id: z.uuidv4(),
  gymId: z.uuidv4(),
  equipmentId: z.uuidv4(),
  count: z.int().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type GymEquipment = z.infer<typeof GymEquipmentSchema>;

export const GymEquipmentPostSchema = GymEquipmentSchema.pick({
  equipmentId: true
}).extend({
  count: z.int().min(1).optional()
});
export type GymEquipmentPost = z.infer<typeof GymEquipmentPostSchema>;

export const GymEquipmentDeleteSchema = GymEquipmentSchema.pick({
  equipmentId: true
})
export type GymEquipmentDelete = z.infer<typeof GymEquipmentDeleteSchema>;


// gymmemberships

export const GymMembershipSchema = z.object({
  id: z.uuidv4(),
  gymId: z.uuidv4(),
  membershipId: z.uuidv4(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type GymMembership = z.infer<typeof GymMembershipSchema>;

export const GymMembershipPostAndDeleteSchema = GymMembershipSchema.pick({
  membershipId: true
});
export type GymMembershipPostAndDelete = z.infer<typeof GymMembershipPostAndDeleteSchema>;


// gym

export const OpeningHoursExceptionSchema = z.object({
  id: z.uuidv4(),
  /* Frontend's gym form handles deleting old exceptions upon opening the form.
  Since old exceptions can, in theory, be as old as the website itself,
  Zod only enforces date to be any date to avoid having
  separate schemas for GET and POST/PUT requests only for exceptions. */
  date: z.coerce.date(),
  hours: ExceptionTimeSchema,
  reason: z.string().min(1),
  concerns: z.enum(['everyone', 'non-members', 'members'])
})
export type OpeningHoursException = z.infer<typeof OpeningHoursExceptionSchema>;

export const HoursExceptionsSchema = z.object({
    data: z.array(OpeningHoursExceptionSchema)
  })
export type HoursExceptions = z.infer<typeof HoursExceptionsSchema>;

export const STREET_NO_MAX_LEN = 20
export const GymSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1).max(255),
  chain: z.string().min(1).max(255).nullable(),
  street: SubLocationNameSchema,
  streetNumber: z.string().min(1).max(STREET_NO_MAX_LEN),
  district: SubLocationNameSchema,
  city: SubLocationNameSchema,
  country: CountrySchema,
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  openingHoursEveryone: HoursSchema,
  openingHoursMembers: HoursSchema,
  openingHoursExceptions: HoursExceptionsSchema,
  url: z.url().nullable(),
  location: z.url(),
  equipmentVisible: z.boolean(),
  membershipsVisible: z.boolean(),
  openingHoursVisible: z.boolean(),
  notes: z.string().min(1).max(255).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type Gym = z.infer<typeof GymSchema>;

export const GymGetEquipmentSchema = z.intersection(
  EquipmentBaseSchema.extend({ gymequipment: GymEquipmentSchema }),
  EquipmentUnions)
export type GymGetEquipment = z.infer<typeof GymGetEquipmentSchema>;

export const GymGetMembershipsSchema = z.intersection(
  MembershipBaseSchema.extend({ gymmemberships: GymMembershipSchema }),
  MembershipUnions)
export type GymGetMemberships = z.infer<typeof GymGetMembershipsSchema>;

export const GymPostSchema = GymSchema.partial({
  id: true,
  chain: true,
  openingHoursEveryone: true,
  openingHoursMembers: true,
  openingHoursExceptions: true,
  equipmentVisible: true,
  membershipsVisible: true,
  openingHoursVisible: true,
  url: true,
  notes: true,
  createdAt: true,
  updatedAt: true
})
export type GymPost = z.infer<typeof GymPostSchema>;

const GymFrontendBaseSchema = GymSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const GymPutSchema = GymFrontendBaseSchema.partial();
export type GymPut = z.infer<typeof GymPutSchema>;

export const GymGetSchema = GymSchema.omit({
  chain: true,
  url: true,
  notes: true
}).extend({
  chain: z.preprocess(
    (val) => (val === null ? '' : val),
    z.string().max(255)
  ),
  url: z.preprocess(
    (val) => (val === null ? '' : val),
    z.string()
  ),
  notes: z.preprocess(
    (val) => (val === null ? '' : val),
    z.string().max(255)
  ),
  managers: z.array(UserSchema.pick({
    id: true,
    username: true,
    email: true,
    name: true
  }).extend({
    gymmanagers: GymManagerSchema
  })),
  memberships: z.array(MembershipSchema),
  equipment: z.array(GymGetEquipmentSchema)
})
export type GymGet = z.infer<typeof GymGetSchema>;

export const GymWithDistanceSchema = GymGetSchema.extend({
  distance: z.number(),
  referencePoint: z.string()
})
export type GymWithDistance = z.infer<typeof GymWithDistanceSchema>;

export const GymFrontendPostAndPutSchema = GymFrontendBaseSchema.omit({
  chain: true,
  latitude: true,
  longitude: true,
  equipmentVisible: true,
  membershipsVisible: true,
  openingHoursVisible: true,
  url: true,
  notes: true
}).extend({
  chain: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().min(1).max(255).nullable()
  ),
  latitude: z.preprocess(
    (val) => (Number(val)),
    LatitudeSchema
  ),
  longitude: z.preprocess(
    (val) => (Number(val)),
    LongitudeSchema
  ),
  equipmentVisible: z.preprocess(
    (val) => (val ? true : false),
    z.boolean()
  ),
  membershipsVisible: z.preprocess(
    (val) => (val ? true : false),
    z.boolean()
  ),
  openingHoursVisible: z.preprocess(
    (val) => (val ? true : false),
    z.boolean()
  ),
  url: z.preprocess(
    (val) => (val === '' ? null : val),
    z.url().nullable()
  ),
  notes: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().min(1).max(255).nullable()
  ),
})
export type GymFrontendPostAndPut = z.infer<typeof GymFrontendPostAndPutSchema>;

const GymFrontendHourSchema = z.preprocess(
  (val) => (val === '' ? null : val),
  z.iso.time().nullable()
)
export const GymFormHoursSchema = z.object({
  everyoneMOOpen: GymFrontendHourSchema,
  everyoneMOClose: GymFrontendHourSchema,
  everyoneTUOpen: GymFrontendHourSchema,
  everyoneTUClose: GymFrontendHourSchema,
  everyoneWEOpen: GymFrontendHourSchema,
  everyoneWEClose: GymFrontendHourSchema,
  everyoneTHOpen: GymFrontendHourSchema,
  everyoneTHClose: GymFrontendHourSchema,
  everyoneFROpen: GymFrontendHourSchema,
  everyoneFRClose: GymFrontendHourSchema,
  everyoneSAOpen: GymFrontendHourSchema,
  everyoneSAClose: GymFrontendHourSchema,
  everyoneSUOpen: GymFrontendHourSchema,
  everyoneSUClose: GymFrontendHourSchema,
  membersMOOpen: GymFrontendHourSchema,
  membersMOClose: GymFrontendHourSchema,
  membersTUOpen: GymFrontendHourSchema,
  membersTUClose: GymFrontendHourSchema,
  membersWEOpen: GymFrontendHourSchema,
  membersWEClose: GymFrontendHourSchema,
  membersTHOpen: GymFrontendHourSchema,
  membersTHClose: GymFrontendHourSchema,
  membersFROpen: GymFrontendHourSchema,
  membersFRClose: GymFrontendHourSchema,
  membersSAOpen: GymFrontendHourSchema,
  membersSAClose: GymFrontendHourSchema,
  membersSUOpen: GymFrontendHourSchema,
  membersSUClose: GymFrontendHourSchema
})
export type GymFormHours = z.infer<typeof GymFormHoursSchema>;


// login

// Auth types for the frontend's AuthContext and root route
export interface AuthState {
  isAuthenticated: boolean
  user: UserFrontend
  login: (username: string, password: string) => Promise<void>
  refresh: () => Promise<string>
  logout: () => Promise<void>
}

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = UserSchema.pick({
  id: true,
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true,
}).extend({
  token: z.string().min(1)
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const LoginRefreshResponseSchema = z.object({
  token: z.jwt()
})
export type LoginRefreshResponse = z.infer<typeof LoginRefreshResponseSchema>;


// locations

export const REF_POINT_MAX_LEN = 23;

const LocationBaseSchema = z.object({
  id: z.uuidv4(),
  name: SubLocationNameSchema,
  referencePoint: z.string().min(1).max(REF_POINT_MAX_LEN),
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export const CitySchema = LocationBaseSchema.extend({
  country: CountrySchema
})
export type City = z.infer<typeof CitySchema>;

export const CityPostAndPutSchema = CitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type CityPostAndPut = z.infer<typeof CityPostAndPutSchema>;

export const DistrictSchema = LocationBaseSchema.extend({
  cityId: z.uuidv4()
})
export type District = z.infer<typeof DistrictSchema>;

export const DistrictPostAndPutSchema = DistrictSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type DistrictPostAndPut = z.infer<typeof DistrictPostAndPutSchema>;

export const CityGetSchema = CitySchema.extend({
  districts: z.array(DistrictSchema)
})
export type CityGet = z.infer<typeof CityGetSchema>;

export const DistrictGetSchema = DistrictSchema.extend({
  city: CitySchema
})
export type DistrictGet = z.infer<typeof DistrictGetSchema>;