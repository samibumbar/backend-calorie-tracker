export const calculateDailyCalories = (
  weight: number,
  height: number,
  age: number,
  desiredWeight: number
): number => {
  return (
    10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight)
  );
};
