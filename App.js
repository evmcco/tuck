import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { addFoodLogItem, getFoodLog, initializeDatabase, clearDatabase, getFoodLogSummary } from './sqlite';

// todo add a faint separator if logs items are made >30 mins apart to show diff meals/snacks

export default function App() {
  const [formCals, setFormCals] = useState('')
  const [formName, setFormName] = useState('')
  const [foodLog, setFoodLog] = useState([])
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const nameInputRef = useRef(null);
  const calsInputRef = useRef(null);


  const fetchData = async () => {
    const data = await getFoodLog()
    setFoodLog(data)
  }

  useEffect(() => {
    initializeDatabase()
    fetchData();
  }, [])

  useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
    setKeyboardVisible(true);
  });
  const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
    setKeyboardVisible(false);
  });

  // Cleanup the event listeners on unmount
  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);

  const onSubmit = () => {
    if (!formName || !formCals) {
      return
    }
    if (!!formName && !formCals) {
      calsInputRef.current.focus();
      return
    }
    addFoodLogItem(formName, formCals)
    setFormCals('')
    setFormName('')
    fetchData();
    nameInputRef.current.focus();
  }

  const formatDate = (date) => {
    const dayOfTheWeek = new Date(date).getDay()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayOfTheWeek]
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/tuckBackground.png')} style={styles.backgroundImage}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>tuck</Text>
          <Text style={styles.subtitleText}>the chill food log</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.nameInput}
            value={formName}
            onChangeText={text => setFormName(text)}
            placeholder="food"
            // placeholderTextColor={'#21212175'}
            placeholderTextColor={'lightgray'}
            onSubmitEditing={() => {
              if (calsInputRef) {
                calsInputRef.current.focus();
              }}
            }
            ref={nameInputRef}
          />
          <TextInput 
            style={styles.calsInput}
            value={formCals}
            onChangeText={num => setFormCals(num)}
            placeholder="cals"
            keyboardType="numeric"
            // placeholderTextColor={'#21212175'}
            placeholderTextColor={'lightgray'}
            ref={calsInputRef}
          />
          <TouchableOpacity onPress={() => onSubmit()}>
            <View style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                {">>"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {foodLog?.map((food, index) => {
              if (food.type === 'summary') {
                return (
                  <View key={`summary${food.month}${food.day}`} style={styles.summaryRow}>
                  <View style={styles.summaryNameContainer}>
                    <Text style={styles.summaryDate}>{`${food.month}/${food.day}`}
                    </Text>
                    <Text style={styles.summaryName}>Total Cals:</Text>
                  </View>
                  <View style={styles.summaryCalsContainer}>
                    <Text style={styles.summaryCals}>{food.totalCalories}</Text>
                  </View>
                </View>
                ) 
              }
              return (
                <View key={`${food.name}${index}`} style={styles.logRow}>
                  <View style={styles.logNameContainer}>
                    <Text style={styles.logDate}>{formatDate(food.date)}
                    </Text>
                    <Text style={styles.logName}>{food.foodname}</Text>
                  </View>
                  <View style={styles.logCalsContainer}>
                    <Text style={styles.logCals}>{food.calories}</Text>
                  </View>
                </View>
              )
            })}
            <TouchableOpacity onPress={() => {
              clearDatabase()
              fetchData()
            }}>
              <Text style={{color: 'red'}}>RESET DATA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <KeyboardAvoidingView behavior="position">
          {keyboardVisible && <TouchableOpacity onPress={() => {onSubmit()}} style={styles.keyboardSubmitButtonContainer}>
            <Text style={styles.keyboardSubmitButtonText}>
              {">>"}
            </Text>
          </TouchableOpacity>}
        </KeyboardAvoidingView>
      </ImageBackground>  
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefae0',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 30,
  },
  subtitleText: {
    fontSize: 20,
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
    borderColor: '#21212120',
    padding: 8,
    fontSize: 20,
    textAlign: 'right',
    backgroundColor: '#21212175',
    color: 'lightgrey'
  },
  calsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#21212120',
    padding: 8,
    fontSize: 20,
    marginLeft: 10,
    backgroundColor: '#21212175',
    color: 'lightgrey'
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  logDate: {
    fontSize: 12,
    color: 'grey',
  },  
  logName: {
    fontSize: 16,
    textAlign: 'right',
  },
  logCalsContainer: {
    flex: 2,
    padding: 8,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logCals: {
    fontSize: 16
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    borderTopWidth: 2,
    borderTopColor: '#a8dadc',
    borderTopStyle: 'solid',
  },
  summaryNameContainer: {
    flex: 3,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  summaryDate: {
    fontSize: 12,
    color: 'grey',
    fontWeight: 'bold',
  },  
  summaryName: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  summaryCalsContainer: {
    flex: 2,
    padding: 8,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  summaryCals: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  keyboardSubmitButtonContainer: {
    backgroundColor: '#a8dadc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  keyboardSubmitButtonText: {
    color: '#1d3557',
    fontSize: 20,
  },
});
