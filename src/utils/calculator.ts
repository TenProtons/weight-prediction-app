export interface UserData {
  weight: number; // in kg
  targetWeight: number; // in kg
  height: number; // in cm
  age: number; // in years
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive";
  currentCalorieIntake: number; // in kcal
  timeFrame: number; // in days
}

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
  if (gender === "male") {
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

export const calculateCalorieAdjustment = (userData: UserData): number => {
  const weightDifference = userData.targetWeight - userData.weight; // kg
  const totalCaloriesNeeded = weightDifference * oneKgBodyWeightKcal; // kcal
  const dailyCalorieAdjustment = totalCaloriesNeeded / userData.timeFrame; // kcal/day
  return dailyCalorieAdjustment;
};

export const predictWeightOverTime = (
  userData: UserData
): Array<{ day: number; weight: number }> => {
  const dailyCalorieAdjustment = calculateCalorieAdjustment(userData);
  const tdee = calculateTDEE(userData);
  const netCalories = userData.currentCalorieIntake - tdee;
  const days = userData.timeFrame;
  const result = [];

  let currentWeight = userData.weight;

  for (let day = 1; day <= days; day++) {
    const dailyWeightChange =
      (netCalories + dailyCalorieAdjustment) / oneKgBodyWeightKcal;
    currentWeight += dailyWeightChange;
    result.push({ day, weight: currentWeight });
  }

  return result;
};
