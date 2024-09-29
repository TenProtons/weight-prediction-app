export interface UserData {
  weight: number; // in kg
  targetWeight: number; // in kg
  height: number; // in cm
  age: number; // in years
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  currentCalorieIntake: number; // in kcal
  timeFrame: number; // in days
}
