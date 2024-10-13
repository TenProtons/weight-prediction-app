import { UserData } from '@/interfaces/UserData';

export const defaultUserData: UserData = {
  weight: 55,
  targetWeight: 50,
  height: 165,
  age: 30,
  gender: 'female',
  activityLevel: 'moderate',
  currentCalorieIntake: 1900,
  timeFrame: 90,
};

export const IMPERIAL_WEIGHT_COEFFICIENT = 2.20462;
export const IMPERIAL_HEIGHT_COEFFICIENT = 2.54;
