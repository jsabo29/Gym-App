import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MealDisplay from '../items/meal-display'
import Graph from '../items/graph';
import { toInteger } from 'lodash';


export default function Meals() {
  const [selectedValue, setSelectedValue] = useState("calories");
  const dateData = new Date()
  console.log(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear())
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());
  
  {/* Change this once the backend is done */}
  const meals = [[376,75,"10-01-2025"],[2951,27,"10-01-2025"],[3516,71,"10-01-2025"],[597,33,"10-01-2025"],[3702,18,"10-02-2025"],[1372,11,"10-02-2025"],[1450,5,"10-02-2025"],[2312,45,"10-03-2025"],[528,60,"10-03-2025"],[2664,34,"10-04-2025"],[336,49,"10-04-2025"],[3275,63,"10-04-2025"],[2103,63,"10-05-2025"],[3036,38,"10-05-2025"],[2333,46,"10-05-2025"],[1370,27,"10-06-2025"],[2418,66,"10-06-2025"],[3145,11,"10-06-2025"],[1632,41,"10-06-2025"],[426,8,"10-07-2025"],[2554,11,"10-07-2025"],[3559,38,"10-08-2025"],[3051,60,"10-08-2025"],[1961,72,"10-08-2025"],[2573,27,"10-09-2025"],[3915,2,"10-09-2025"],[252,7,"10-09-2025"],[3457,24,"10-09-2025"],[727,76,"10-10-2025"],[3277,80,"10-10-2025"],[946,55,"10-11-2025"],[261,16,"10-11-2025"],[1451,58,"10-11-2025"],[904,26,"10-12-2025"],[3015,77,"10-12-2025"],[875,29,"10-12-2025"],[1944,7,"10-12-2025"],[3589,3,"10-13-2025"],[114,15,"10-13-2025"],[2369,32,"10-13-2025"],[3797,37,"10-14-2025"],[556,46,"10-14-2025"],[346,17,"10-14-2025"],[621,19,"10-15-2025"],[3949,41,"10-15-2025"],[2490,29,"10-15-2025"],[1235,52,"10-15-2025"],[3174,71,"10-16-2025"],[1833,40,"10-16-2025"],[766,60,"10-16-2025"],[210,14,"10-16-2025"],[3758,14,"10-17-2025"],[2914,53,"10-17-2025"],[277,55,"10-18-2025"],[2347,47,"10-18-2025"],[165,20,"10-18-2025"],[834,23,"10-18-2025"],[127,68,"10-19-2025"],[1673,60,"10-19-2025"],[1953,79,"10-19-2025"],[2238,0,"10-19-2025"],[3920,47,"10-20-2025"],[2696,80,"10-20-2025"],[2813,66,"10-20-2025"],[3887,41,"10-21-2025"],[943,35,"10-21-2025"],[2997,45,"10-21-2025"],[2188,68,"10-21-2025"],[2279,33,"10-22-2025"],[2436,47,"10-22-2025"],[3958,43,"10-22-2025"],[190,71,"10-22-2025"],[3632,25,"10-23-2025"],[1682,68,"10-23-2025"],[3018,47,"10-23-2025"],[2512,60,"10-24-2025"],[2629,52,"10-24-2025"],[2286,64,"10-24-2025"],[3505,3,"10-24-2025"],[1665,66,"10-25-2025"],[3281,69,"10-25-2025"],[2063,11,"10-25-2025"],[583,52,"10-25-2025"]];
  const aggregateData = aggregateMeals(meals)
  const caloriesData = aggregateData.map((array) => ({x: array[2], y: array[0]}));
  const proteinData = aggregateData.map((array) => ({x: array[2], y: array[1]}));

  const caloriesThisWeek = caloriesData.length > 6 ? caloriesData.slice(-7).map(item => item.y).reduce((sum, val) => sum + val) : caloriesData.map(item => item.y).reduce((sum, val) => sum + val, 0);
  const caloriesLastWeek = caloriesData.length > 13 ? caloriesData.slice(-14, -7).map(item => item.y).reduce((sum, val) => sum + val) : (caloriesData.length > 6 ? caloriesData.slice(0, -7).map(item => item.y).reduce((sum, val) => sum + val, 0)*(7/(caloriesData.length-6)) : caloriesThisWeek);
  const calorieAverage = toInteger(caloriesThisWeek/(Math.min(7, caloriesData.length+1)));
  const calorieChange = toInteger((caloriesThisWeek/caloriesLastWeek-1)*100)
  const proteinThisWeek = proteinData.length > 6 ? proteinData.slice(-7).map(item => item.y).reduce((sum, val) => sum + val) : proteinData.map(item => item.y).reduce((sum, val) => sum + val, 0);
  const proteinLastWeek = proteinData.length > 13 ? proteinData.slice(-14, -7).map(item => item.y).reduce((sum, val) => sum + val) : (proteinData.length > 6 ? proteinData.slice(0, -7).map(item => item.y).reduce((sum, val) => sum + val, 0)*(7/(proteinData.length-6)) : proteinThisWeek);
  const proteinChange = toInteger((proteinThisWeek/proteinLastWeek-1)*100)
  const proteinAverage = toInteger(proteinThisWeek/(Math.min(7, proteinData.length+1)));

  return(
    <ScrollView contentContainerStyle={styles.page}>
      {console.log(selectedValue == 'calories' ? caloriesData : proteinData)}
      <Graph data={selectedValue == 'calories' ? caloriesData : proteinData}/>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Your </Text>
        <Picker 
          style={styles.graphPicker}
          selectedValue={selectedValue}
          dropdownIconColor="transparent"
          onValueChange={(itemValue) => setSelectedValue(itemValue)}>
            <Picker.Item label='Protein' value='protein'/>
            <Picker.Item label='Calories' value='calories'/>
          </Picker>
        <Text style={styles.text}>{selectedValue=='calories' ? ' are' : ' is'} {selectedValue=='calories' ? (calorieChange >= 0 ? 'up' : 'down') : (proteinChange >= 0 ? 'up' : 'down')} {selectedValue=='calories' ? Math.abs(calorieChange) : Math.abs(proteinChange)}% from last week with an average of {selectedValue=='calories' ? calorieAverage : proteinAverage + 'g'} per day.</Text>
      </View>
      <View style={styles.bottomContainer}>
        {/* This is to add another meal to the log */}
        <Text style={styles.title}>Log a Meal</Text>
        <View style={styles.addContainer}>
          <Text style={styles.label}>Calories</Text>
          <TextInput 
            defaultValue='800'
            style={[styles.textbox, {width: 90}]}/>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput 
            defaultValue='30'
            style={[styles.textbox, {width: 50}]}/>
          <Text style={styles.label}>Date</Text>
          <TextInput 
            placeholder="MM-DD-YYYY"
            placeholderTextColor="#5E6572"
            keyboardType="numbers-and-punctuation"
            value={date}
            onChangeText={()=>setDate()}
            style={[styles.textbox, {width: 210}]}/>
        </View>
        <Pressable style={styles.submit}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>

      <View>
        {meals.map((array, index) =>
          <MealDisplay key={index} calories={array[0]} protein={array[1]} date={array[2]}/>
        )}
      </View>
    </ScrollView> 
  )
}

function aggregateMeals(meals) {
  const totals = {};

  meals.forEach(([calories, protein, date]) => {
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
    padding: 40,
    paddingBottom: 0,
    backgroundColor: "#5E6572",
    alignItems: "center",
  },
  graph: {
    height: 400,
    aspectRatio: "1",
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
    color: '#EEF1EF'
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center'
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
    alignItems: "center"
  },
  addContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  textbox: {
    padding: 4,
    backgroundColor: '#EEF1EF',
    color: 'black',
    fontSize: 30,
    border: 'none',
    borderRadius: 7,
  },
  label: {
    marginLeft: 12,
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
  }
})