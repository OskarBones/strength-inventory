import 'zod/compile'
import { z } from 'zod'

import {
  CitySchema,
  DistrictSchema,
  EquipmentBaseSchema,
  EquipmentCategorySchema,
  EquipmentWeightUnitEnum,
  GymEquipmentSchema,
  GymManagerSchema,
  GymMembershipSchema,
  GymSchema,
  LatitudeSchema,
  LongitudeSchema,
  MembershipBaseSchema,
  MembershipTimeUnitEnum,
  MembershipWithChainSchema,
  UserSchema,
  WeightSchema
} from './schemas'

const UrlFrontendSchema = z.preprocess(
  (val) => (val === '' ? null : val),
  z.url().nullable()
)
const NullableStringFrontendSchema =  z.preprocess(
  (val) => (val === '' ? null : val),
  z.string().min(1).max(255).nullable()
)

const LatitudeFrontendSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return Number(Number.parseFloat(val).toFixed(5))
  }
  return val;
}, LatitudeSchema)
const LongitudeFrontendSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return Number(Number.parseFloat(val).toFixed(5))
  }
  return val;
}, LongitudeSchema)


// city and district

export const CityFrontendBaseSchema = CitySchema.extend({
  latitude: LatitudeFrontendSchema,
  longitude: LongitudeFrontendSchema
})

export const CityFrontendPostAndPutSchema = CityFrontendBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type CityFrontendPostAndPut = z.infer<typeof CityFrontendPostAndPutSchema>;

export const DistrictFrontendBaseSchema = DistrictSchema.extend({
  latitude: LatitudeFrontendSchema,
  longitude: LongitudeFrontendSchema
})

export const CityFrontendGetSchema = CityFrontendBaseSchema.extend({
  districts: z.array(DistrictFrontendBaseSchema)
})
export type CityFrontendGet = z.infer<typeof CityFrontendGetSchema>;

export const DistrictFrontendPostAndPutSchema = DistrictFrontendBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type DistrictFrontendPostAndPut = z.infer<typeof DistrictFrontendPostAndPutSchema>

export const DistrictFrontendGetSchema = DistrictFrontendBaseSchema.extend({
  city: CityFrontendBaseSchema
})
export type DistrictFrontendGet = z.infer<typeof DistrictFrontendGetSchema>;


// equipment

const EquipmentWithWeightsFrontendSchema = z.object({
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
  }, WeightSchema.nullable()),
  startingWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, WeightSchema.nullable()),
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
  }, WeightSchema.nullable()),
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

const EquipmentWithoutWeightsFrontendSchema = z.object({
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
  availableWeights: z.array(z.float32()).length(0, 'select a weight unit to use weights'),
  maximumWeight: z.preprocess((val) => {
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
  }, z.null('select a weight unit to use weights'))
})

const EquipmentWeightsFrontendSchema = z.discriminatedUnion('weightUnit', [
  EquipmentWithWeightsFrontendSchema, EquipmentWithoutWeightsFrontendSchema
])

const EquipmentFrontendUnions = z.intersection(EquipmentCategorySchema, EquipmentWeightsFrontendSchema)

const EquipmentFrontendBaseSchema = EquipmentBaseSchema.extend({
  url: UrlFrontendSchema,
  notes: NullableStringFrontendSchema
})

export const EquipmentFrontendGetSchema = z.intersection(EquipmentFrontendBaseSchema, EquipmentFrontendUnions)
export type EquipmentFrontendGet = z.infer<typeof EquipmentFrontendGetSchema>

export const EquipmentFrontendPostAndPutSchema = z.intersection(EquipmentFrontendBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  generic: z.preprocess(
    (val) => (val ? true : false),
    z.boolean()
  ),
  outOfProduction: z.preprocess(
    (val) => (val ? true : false),
    z.boolean()
  )
}), EquipmentFrontendUnions)
export type EquipmentFrontendPostAndPut = z.infer<typeof EquipmentFrontendPostAndPutSchema>


// membership

const MembershipWithoutChainFrontendSchema = z.object({
  chain: z.preprocess((val) => {
    if (val) {
      return val
    } else {
      return null
    }
  }, z.null()),
  country: z.preprocess((val) => {
    if (val) {
      return val
    } else {
      return null
    }
  }, z.null()),
})

const MembershipChainFrontendSchema = z.union([
  MembershipWithChainSchema, MembershipWithoutChainFrontendSchema
])

const MembershipWithCommitmentFrontendSchema = z.object({
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

const MembershipWithoutCommitmentFrontendSchema = z.object({
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

const MembershipCommitmentFrontendSchema = z.discriminatedUnion('commitmentUnit', [
  MembershipWithCommitmentFrontendSchema, MembershipWithoutCommitmentFrontendSchema
])

const MembershipFrontendUnions = z.intersection(MembershipChainFrontendSchema, MembershipCommitmentFrontendSchema)

const MembershipFrontendBaseSchema = MembershipBaseSchema.extend({
  initiationFee: z.preprocess((val) => {
  return(Number(val))
}, z.number().nullable()),
  membershipFee: z.preprocess((val) => {
    return(Number(val))
  }, z.number()),
  url: UrlFrontendSchema,
  notes: NullableStringFrontendSchema
})

export const MembershipFrontendGetSchema = z.intersection(MembershipFrontendBaseSchema, MembershipFrontendUnions)
export type MembershipFrontendGet = z.infer<typeof MembershipFrontendGetSchema>

export const MembershipFrontendPostAndPutSchema = z.intersection(MembershipFrontendBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
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
  }, z.int())
}), MembershipFrontendUnions)
export type MembershipFrontendPostAndPut = z.infer<typeof MembershipFrontendPostAndPutSchema>;


// gym

export const GymFrontendGetEquipmentSchema = z.intersection(
  EquipmentBaseSchema.extend({ gymequipment: GymEquipmentSchema }),
  EquipmentFrontendUnions)
export type GymFrontendGetEquipment = z.infer<typeof GymFrontendGetEquipmentSchema>;

export const GymFrontendGetMembershipsSchema = z.intersection(
  MembershipBaseSchema.extend({ gymmemberships: GymMembershipSchema }),
  MembershipFrontendUnions)
export type GymFrontendGetMemberships = z.infer<typeof GymFrontendGetMembershipsSchema>;

const GymFrontendBaseSchema = GymSchema.extend({
  chain: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(255).nullable()
  ),
  latitude: LatitudeFrontendSchema,
  longitude: LongitudeFrontendSchema,
  url: UrlFrontendSchema,
  notes: NullableStringFrontendSchema
}) 

export const GymFrontendGetSchema = GymFrontendBaseSchema.extend({
  managers: z.array(UserSchema.pick({
    id: true,
    username: true,
    email: true,
    name: true
  }).extend({
    gymmanagers: GymManagerSchema
  })),
  memberships: z.array(MembershipFrontendGetSchema),
  equipment: z.array(GymFrontendGetEquipmentSchema)
})
export type GymFrontendGet = z.infer<typeof GymFrontendGetSchema>;

export const GymWithDistanceSchema = GymFrontendGetSchema.extend({
  distance: z.number(),
  referencePoint: z.string()
})
export type GymWithDistance = z.infer<typeof GymWithDistanceSchema>;

export const GymFrontendPostAndPutSchema = GymFrontendBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
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