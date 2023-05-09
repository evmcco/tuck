import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Keyboard, FlatList } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { addFoodLogItem, getFoodLog, initializeDatabase, clearDatabase, getFoodLogSummary } from './sqlite';

// todo launch to app store
// todo better styling for bigger phones
// todo add a faint separator if logs items are made >30 mins apart to show diff meals/snacks

export default function App() {
  const [formCals, setFormCals] = useState('')
  const [formName, setFormName] = useState('')
  const [foodLog, setFoodLog] = useState([])
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const nameInputRef = useRef(null);
  const calsInputRef = useRef(null);


  const fetchData = async () => {
    await initializeDatabase()
    const data = await getFoodLog()
    setFoodLog(data)
  }

  useEffect(() => {
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
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
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
            // placeholderTextColor={'#42424275'}
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
            // placeholderTextColor={'#42424275'}
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
        {/* <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {foodLog?.map((food, index) => {
              if (food.type === 'summary') {
                return (
                  <View key={`summary${food.month+1}${food.day}`} style={styles.summaryRow}>
                  <View style={styles.summaryNameContainer}>
                    <Text style={styles.summaryDate}>{`${food.month+1}/${food.day}`}
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
        </ScrollView> */}
        <FlatList
          data={foodLog}
          keyExtractor={(item, index) => `${item.name}${index}`}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            if (item.type === 'summary') {
              return (
                <View key={`summary${item.month+1}${item.day}`} style={styles.summaryRow}>
                  <View style={styles.summaryNameContainer}>
                    <Text style={styles.summaryDate}>{`${item.month+1}/${item.day}`}</Text>
                    <Text style={styles.summaryName}>total</Text>
                  </View>
                  <View style={styles.summaryCalsContainer}>
                    <Text style={styles.summaryCals}>{item.totalCalories}</Text>
                  </View>
                </View>
              );
            } else {
              return (
                <View key={`${item.name}`} style={styles.logRow}>
                  <View style={styles.logNameContainer}>
                    <Text style={styles.logDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.logName} numberOfLines={1}>{item.foodname}</Text>
                  </View>
                  <View style={styles.logCalsContainer}>
                    <Text style={styles.logCals}>{item.calories}</Text>
                  </View>
                </View>
              );
            }
          }}
          ListFooterComponent={() => (
            <TouchableOpacity onPress={() => {
              clearDatabase();
              fetchData();
            }}>
              <Text style={{ color: 'red' }}>RESET DATA</Text>
            </TouchableOpacity>
          )}
        />
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
    marginHorizontal: 20,
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
    marginHorizontal: 20,
  },
  nameInput: {
    // flex: 3,
    width: '60%',
    borderWidth: 1,
    borderColor: '#42424220',
    padding: 8,
    fontSize: 20,
    textAlign: 'right',
    backgroundColor: '#42424275',
    color: '#EEEEEE',
    borderRadius: 5,
  },
  calsInput: {
    width: '20%',
    borderWidth: 1,
    borderColor: '#42424220',
    padding: 8,
    fontSize: 20,
    marginLeft: 10,
    backgroundColor: '#42424275',
    color: '#EEEEEE',
    borderRadius: 5,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a8dadc',
    borderWidth: 1,
    borderColor: '#a8dadc',
    padding: 8,
    marginLeft: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#1d3557',
    fontSize: 20,
  },
  logRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  logNameContainer: {
    // flex: 3,
    width: '60%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logDate: {
    fontSize: 12,
    color: '#424242',
  },  
  logName: {
    fontSize: 16,
    textAlign: 'right',
    color: '#424242'
  },
  logCalsContainer: {
    // flex: 2,
    width: '20%',
    paddingVertical: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logCals: {
    fontSize: 16,
    color: '#424242'
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 4,
    marginVertical: 5,
    backgroundColor: '#42424215',
    borderRadius: 5,
  },
  summaryNameContainer: {
    // flex: 3,
    width: '60%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summaryDate: {
    fontSize: 12,
    color: '#424242',
    fontWeight: 'bold',
  },  
  summaryName: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  summaryCalsContainer: {
    // flex: 2,
    width: '20%',
    paddingLeft: 8,
    flexDirection: 'row',
  },
  summaryCals: {
    fontSize: 16,
    fontWeight: 'bold',
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
