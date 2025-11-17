import {useState, useEffect} from 'react';
import { Dimensions, StyleSheet, Text, View, Pressable, ScrollView, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { toInteger } from 'lodash';

import MealDisplay from '../items/meal-display'
import Graph from '../items/graph';
import FillerDisplay from '../items/filler-display.js'
import Sidebar from '../items/sidebar.js'

import {fetchMeals, addMeal, removeMeal} from '../supa.js'

export default function Meals({navigation}) {
  const dateData = new Date()
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());
  
  const [meals, setMeals] = useState([])
  useEffect(() => {
    fetchMeals().then(setMeals)
  }, [])
  const aggregateData = aggregateMeals(meals);
  const caloriesData = aggregateData.map((array) => ({x: array[2], y: array[0]}));
  const proteinData = aggregateData.map((array) => ({x: array[2], y: array[1]}));

  const caloriesThisWeek = caloriesData.length > 6 ? caloriesData.slice(-6).map(item => item.y).reduce((sum, val) => sum + val) : caloriesData.map(item => item.y).reduce((sum, val) => sum + val, 0);
  const caloriesLastWeek = caloriesData.length > 13 ? caloriesData.slice(-13, -6).map(item => item.y).reduce((sum, val) => sum + val) : (caloriesData.length > 6 ? caloriesData.slice(0, -6).map(item => item.y).reduce((sum, val) => sum + val, 0)*(7/(caloriesData.length-6)) : caloriesThisWeek);
  const calorieAverage = toInteger(caloriesThisWeek/(Math.min(7, caloriesData.length)));
  const calorieChange = toInteger((caloriesThisWeek/caloriesLastWeek-1)*100)
  const proteinThisWeek = proteinData.length > 6 ? proteinData.slice(-6).map(item => item.y).reduce((sum, val) => sum + val) : proteinData.map(item => item.y).reduce((sum, val) => sum + val, 0);
  const proteinLastWeek = proteinData.length > 13 ? proteinData.slice(-13, -6).map(item => item.y).reduce((sum, val) => sum + val) : (proteinData.length > 6 ? proteinData.slice(0, -6).map(item => item.y).reduce((sum, val) => sum + val, 0)*(7/(proteinData.length-6)) : proteinThisWeek);
  const proteinChange = toInteger((proteinThisWeek/proteinLastWeek-1)*100)
  const proteinAverage = toInteger(proteinThisWeek/(Math.min(7, proteinData.length)));

  const [calories, setCalories] = useState(caloriesData.length > 0 ? caloriesData[caloriesData.length-1][0] : 800)
  const [protein, setProtein] = useState(proteinData.length > 0 ? proteinData[proteinData.length-1][0] : 30)
  
  //screen data
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  // Listen for window size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });
    return () => subscription?.remove();
  }, []);
  const aspectRatio = windowWidth/windowHeight

  const pickerItems = [{label: 'Calories', value: 'calories'}, {label: 'Protein', value: 'protein'}]
  const [selectedValue, setSelectedValue] = useState("calories");
  const [open, setOpen] = useState(false)

  return(
    <ScrollView contentContainerStyle={[styles.page, {flexDirection: 1.2*windowHeight<windowWidth ? 'row' : 'column'}]}>

      {/* Sidebar and/or Bottombar */}
      {aspectRatio>1.2 && 
      <View style={{height: windowHeight}}>
        <Sidebar navigation={navigation} text={aspectRatio > 1.8}/>
      </View>
      }

      {/* Graph and Add Menu */}
      <ScrollView contentContainerStyle={[styles.page, {alignItems: 'center', justifyContent: 'flex-start', height: 1.2*windowHeight<windowWidth ? windowHeight : 'auto'}]}>
        <Graph data={selectedValue == 'calories' ? caloriesData : proteinData} size={Math.max(windowHeight*0.4, windowWidth*0.4)}/>
        <View style={[styles.textContainer, {marginTop: 20}]}>
          <DropDownPicker
            open={open}
            value={selectedValue}
            items={pickerItems}
            setOpen={setOpen}
            setValue={setSelectedValue}
            containerStyle={{ width: 200 }}
            style={{ backgroundColor: '#FF4B0A', zIndex: 100}}
            textStyle={{ color: '#000', fontSize: 20 }}
          />
        </View>
        <View style={[styles.textContainer, {marginTop: 20}]}>
          <Text style={styles.text}>{selectedValue=='calories' ? (calorieChange >= 0 ? 'Up' : 'Down') : (proteinChange >= 0 ? 'Up' : 'Down')} {selectedValue=='calories' ? Math.abs(calorieChange) : Math.abs(proteinChange)}% from last week.</Text>
          <Text style={styles.text}>Weekly average: {selectedValue=='calories' ? calorieAverage : proteinAverage + 'g'}</Text>
        </View>
        <View style={styles.bottomContainer}>
          {/* This is to add another meal to the log */}
          <Text style={[styles.title, {fontSize: Math.min(50, windowWidth/9)}]}>Log a Meal</Text>
          {windowHeight < windowWidth &&
          <View style={styles.addContainer}>
            <Text style={styles.label}>Calories</Text>
            <TextInput 
              value={calories ?? ''}
              onChangeText={setCalories}
              style={[styles.textbox, {width: 90}]}/>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput 
              value={protein ?? ''}
              onChangeText={setProtein}
              style={[styles.textbox, {width: 50}]}/>
            <Text style={styles.label}>Date</Text>
            <TextInput 
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#5E6572"
              keyboardType="numbers-and-punctuation"
              value={date}
              onChangeText={setDate}
              style={[styles.textbox, {width: 170}]}/>
          </View>}
          {windowHeight >= windowWidth && 
          <View style={styles.rowContainer}>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Calories</Text>
              <TextInput 
                value={calories ?? ''}
                onChangeText={setCalories}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput 
                value={protein ?? ''}
                onChangeText={setProtein}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Date</Text>
              <TextInput 
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#5E6572"
                keyboardType="numbers-and-punctuation"
                value={date}
                onChangeText={setDate}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
          </View>}
          <Pressable style={styles.submit} onPress={async () => {
            const newData = await addMeal({calories, protein, date});
            if (newData) {
              setMeals(prev => [...prev, ...newData]); // update state        
            }}}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Data List Displays */}
      {windowHeight>=windowWidth &&
      <View style={[{padding: 20, justifyContent: 'center', alignItems: 'center', paddingBottom: 100}]}>
        {meals.slice().reverse().map((data, index) =>
          <MealDisplay key={index} index={meals.length-index-1} calories={data.calories} protein={data.protein} date={data.date} onDelete={deleteRow} width={windowWidth*0.95}/>
        )}
        {meals.length == 0 && <FillerDisplay width={windowWidth*0.95}/>}
      </View>}
      {windowHeight<windowWidth &&
      <View style={{height:windowHeight, alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: '#555'}}>
        <ScrollView contentContainerStyle={[{padding: 20, height:windowHeight, alignItems: 'center'}]}>
          {meals.slice().reverse().map((data, index) =>
            <MealDisplay key={index} index={meals.length-index-1} calories={data.calories} protein={data.protein} date={data.date} onDelete={deleteRow} width={windowWidth*0.3}/>
          )}
          {meals.length == 0 && <FillerDisplay width={windowWidth*0.3}/>}
        </ScrollView>
      </View>}
    </ScrollView> 
  )
  function deleteRow(index) {
      removeMeal({id: meals[index].id})
      setMeals(prev => prev.filter((_, i) => i !== index))
    }
}

function aggregateMeals(meals) {
  const totals = {};

  meals.forEach(({calories, protein, date}) => {
    if (!totals[date]) {
      totals[date] = { calories: 0, protein: 0 };
    }
    totals[date].calories += calories;
    totals[date].protein += protein;
  });

  // Convert back to array form if needed:
  return Object.entries(totals).map(([date, { calories, protein }]) => [
    calories,
    protein,
    date
  ]);
}

const styles=StyleSheet.create({
  page: {
    flexGrow: 1,
    paddingBottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  graphPicker: {
    backgroundColor: '#FF4B0A',
    color: '#EEF1EF',
    height: 36,
    fontSize: 30,
    border: 'none',
    borderRadius: 5,
    userSelect: "none"
  },
  text: {
    fontSize: 30,
    color: '#EEF1EF',
    textAlign: 'center'
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 50,
    color: '#EEF1EF',
    marginTop: 45,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  bottomContainer: {
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
  },
  addContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textbox: {
    padding: 4,
    backgroundColor: '#25272D',
    color: '#EEF1EF',
    fontSize: 30,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FF4B0A'
  },
  label: {
    marginLeft: 6,
    color: '#EEF1EF',
    fontSize: 30,
    margin: 4,
  },
  submit: {
    borderRadius: 10,
    width: 130,
    margin: 30,
    height: 50,
    backgroundColor: '#FF4B0A',
    border: 'none',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    color: '#EEF1EF',
    fontSize: 30,
    userSelect: 'none'
  },
  dateButton: {
    borderRadius: 10,
    width: 200,
    height: 50,
    backgroundColor: '#EEF1EF',
    border: 'none',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateButtonText: {
    color: 'black',
    fontSize: 30,
    userSelect: 'none'
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})