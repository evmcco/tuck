import * as SQLite from "expo-sqlite";

const openDatabase = () => {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

// Create table
export const initializeDatabase = () => {
  const db = openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS foodlog (id INTEGER PRIMARY KEY AUTOINCREMENT, foodname TEXT, calories INTEGER, date TEXT);'
    );
  });
}

// Insert data
export const addFoodLogItem = (name, calories) => {
  const db = openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO foodlog (foodname, calories, date) VALUES (?, ?, ?)',
      [name, calories, new Date().toISOString()],
      (tx, results) => {
      }
    );
  });
}

const formatFoodLog = (foodLog) => {
  //loop through food log
  //once you hit the last entry for a day, add a summary row that contains the date and total calories for that day
  const formattedFoodLog = []
  let currentDayTotal = 0
  for (let i = foodLog.length - 1; i >= 0; i--) {
    currentDayTotal += foodLog[i].calories
    //check to see if the day of the month is different, not perfect but solid
    if (i === 0) {
      formattedFoodLog.unshift(foodLog[i])
      formattedFoodLog.unshift({
        type: 'summary',
        month: new Date(foodLog[i].date).getMonth(),
        day: new Date(foodLog[i].date).getDate(),
        totalCalories: currentDayTotal
      })
      return formattedFoodLog
    }
    formattedFoodLog.unshift(foodLog[i])
    if (new Date(foodLog[i].date).getDate() !== new Date(foodLog[i - 1].date).getDate()) {
      formattedFoodLog.unshift({
        type: 'summary',
        month: new Date(foodLog[i].date).getMonth(),
        day: new Date(foodLog[i].date).getDate(),
        totalCalories: currentDayTotal
      })
      currentDayTotal = 0
    }
  }
}

// Select data
export const getFoodLog = () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM foodlog ORDER BY date DESC',
        [],
        (tx, { rows: { _array } }) => {
          const formattedFoodLog = formatFoodLog(_array)
          resolve(formattedFoodLog);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

// Delete all data
export const clearDatabase = () => {
  const db = openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM foodlog',
      [],
      (tx, results) => {
        console.log('rowsAffected:', results.rowsAffected);
      }
    );
  });
}

