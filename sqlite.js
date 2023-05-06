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


// Select data
export const getFoodLog = () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM foodlog ORDER BY date',
        [],
        (tx, { rows: { _array } }) => {
          console.log("###, _array", _array)
          resolve(_array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

// export const getFoodLog = () => {
//   const db = openDatabase();
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM foodlog',
//       [],
//       (tx, { rows: { _array } }) => {
//         console.log("###, _array", _array)
//         return _array;
//       }
//     );
//   });
// }


// // Update data
// db.transaction(tx => {
//   tx.executeSql(
//     'UPDATE foodlog SET calories = ? WHERE foodname = ?',
//     [120, 'Apple'],
//     (tx, results) => {
//       console.log('rowsAffected:', results.rowsAffected);
//     }
//   );
// });

// // Delete data
// db.transaction(tx => {
//   tx.executeSql(
//     'DELETE FROM foodlog WHERE foodname = ?',
//     ['Apple'],
//     (tx, results) => {
//       console.log('rowsAffected:', results.rowsAffected);
//     }
//   );
// });
