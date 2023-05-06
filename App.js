import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { addFoodLogItem, getFoodLog, initializeDatabase } from './sqlite';

// can I show the history as one huge list below the form? each day has a summary row at the top
// add a faint separator if logs items are made >30 mins apart to show diff meals/snacks

export default function App() {
  const [formCals, setFormCals] = useState('')
  const [formName, setFormName] = useState('')
  const [foodLog, setFoodLog] = useState([])

  const fetchData = async () => {
    const data = await getFoodLog()
    setFoodLog(data)
  }

  useEffect(() => {
    initializeDatabase()
    fetchData();
  }, [])


  const onSubmit = () => {
    addFoodLogItem(formName, formCals)
    fetchData();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
        <Text>tuck</Text>
        <Text>the chill food log</Text>
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.nameInput}
            value={formName}
            onChangeText={text => setFormName(text)}
            placeholder="what did you eat?"
          />
          <TextInput 
            style={styles.calsInput}
            value={formCals}
            onChangeText={num => setFormCals(num)}
            placeholder="cals"
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => onSubmit()}>
            <View style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                {">>"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {foodLog?.map((food, index) => {
            console.log("!@# food", index, food)
            return (
              <View key={`${food.name}${index}`} style={styles.logRow}>
                <View style={styles.logNameContainer}>
                  <Text style={styles.logName}>{food.foodname}</Text>
                </View>
                <View style={styles.logCalsContainer}>
                  <Text style={styles.logCals}>{food.calories}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefae0',
    paddingTop: 50,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  nameInput: {
    flex: 3,
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    fontSize: 20,
    textAlign: 'right',
  },
  calsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    fontSize: 20,
    marginLeft: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#a8dadc',
    borderWidth: 1,
    borderColor: '#a8dadc',
    padding: 8,
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#1d3557',
    fontSize: 20,
  },
  logRow: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  logNameContainer: {
    flex: 3,
    padding: 8,
  },
  logName: {
    fontSize: 16,
    textAlign: 'right',
  },
  
  logCalsContainer: {
    flex: 2,
    padding: 8,
    marginLeft: 10,
  },
  logCals: {
    fontSize: 16
  },
});
