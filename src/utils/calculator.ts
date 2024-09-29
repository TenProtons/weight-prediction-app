import { UserData } from '@/interfaces/UserData';

export const activityFactor = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const oneKgBodyWeightKcal = 7700;

export const calculateBMR = (userData: UserData): number => {
  const { weight, height, age, gender } = userData;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (userData: UserData): number => {
  const bmr = calculateBMR(userData);
  const factor = activityFactor[userData.activityLevel];
  return bmr * factor;
};

export const calculateRequiredDailyIntake = (userData: UserData): number => {
  const weightDifference = userData.targetWeight - userData.weight; // kg
  const totalCaloriesNeeded = weightDifference * oneKgBodyWeightKcal; // kcal
  const dailyCalorieDeficit = totalCaloriesNeeded / userData.timeFrame; // kcal/day
  const tdee = calculateTDEE(userData); // kcal/day
  const requiredDailyIntake = tdee + dailyCalorieDeficit; // kcal/day
  return requiredDailyIntake;
};

export const calculateCalorieAdjustment = (userData: UserData): number => {
  const requiredDailyIntake = calculateRequiredDailyIntake(userData);
  const calorieAdjustment = requiredDailyIntake - userData.currentCalorieIntake;
  return calorieAdjustment;
};

export const predictWeightOverTime = (userData: UserData): Array<{ day: number; weight: number }> => {
  const requiredDailyIntake = calculateRequiredDailyIntake(userData);
  const tdee = calculateTDEE(userData);
  const days = userData.timeFrame;
  const result = [];

  let currentWeight = userData.weight;

  for (let day = 1; day <= days; day++) {
    const netCalories = requiredDailyIntake - tdee;
    const dailyWeightChange = netCalories / oneKgBodyWeightKcal;
    currentWeight += dailyWeightChange;
    result.push({ day, weight: currentWeight });
  }

  return result;
};
