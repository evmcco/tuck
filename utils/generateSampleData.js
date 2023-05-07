export const generateSampleData = () => {
  const sampleFoodLog = [];

  // Set the start date to one month ago
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  // Generate 500 rows of data
  for (let i = 0; i < 50; i++) {
    // Generate a random number of calories between 50 and 500
    const calories = Math.floor(Math.random() * 451) + 50;

    // Generate a random date between the start date and today
    const date = new Date(startDate.getTime() + Math.random() * (new Date() - startDate)).toISOString();

    // Generate a random food name
    const foodName = `Food ${i + 1}`;

    // Add the row to the foodLog array
    sampleFoodLog.push({
      foodname: foodName,
      calories: calories,
      date: date
    });
  }
  return sampleFoodLog
}