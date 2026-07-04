import type {
  City,
  District,
  Equipment,
  Gym,
  GymEquipment,
  GymManagers,
  GymMemberships,
  Membership,
  User
} from './src/models/index.ts';

declare global {
  namespace Express {
    interface Request {
      token?: string,
      user?: User,
      targetUser?: User,
      targetCity?: City,
      targetDistrict?: District,
      targetGym?: Gym,
      targetEquipment?: Equipment,
      targetMembership?: Membership,
      targetGymEquipment?: GymEquipment,
      targetGymManager?: GymManagers,
      targetGymMembership?: GymMemberships
    }
  }
}
