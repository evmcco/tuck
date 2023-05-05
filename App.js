import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [formCals, setFormCals] = useState(0)
  const [formName, setFormName] = useState('')

  const [foodLog, setFoodLog] = useState([])

  const onSubmit = () => {
    console.log("!!! submitting")
    let tempFoodLog = [...foodLog]
    tempFoodLog.push({
      name: formName,
      cals: formCals,
    })
    setFoodLog(tempFoodLog)
    //take the name and cals and save them to the sqlite db
    //clear the form
    setFormName('')
    setFormCals(0)
    //refresh the list
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
                Submit
              </Text>
            </View>
          </TouchableOpacity>
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
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 50,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nameInput: {
    flexGrow: 3,
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    fontSize: 20,
  },
  calsInput: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    fontSize: 20,
    marginLeft: 10,
  },
  submitButton: {
    flexGrow: 2,
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
});
