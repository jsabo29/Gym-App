import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MealDisplay from '../items/meal-display'
import Graph from '../items/graph';
import { toInteger } from 'lodash';
import {fetchMeals, addMeal, removeMeal} from '../supa.js'

export default function Meals() {
  const [selectedValue, setSelectedValue] = useState("calories");
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
  

  return(
    <ScrollView contentContainerStyle={styles.page}>
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
        <Text style={styles.text}>{selectedValue=='calories' ? ' are' : ' is'} {selectedValue=='calories' ? (calorieChange >= 0 ? 'up' : 'down') : (proteinChange >= 0 ? 'up' : 'down')} {selectedValue=='calories' ? Math.abs(calorieChange) : Math.abs(proteinChange)}% from last week.</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>This week you averaged {selectedValue=='calories' ? calorieAverage : proteinAverage + 'g'} per day.</Text>
      </View>
      <View style={styles.bottomContainer}>
        {/* This is to add another meal to the log */}
        <Text style={styles.title}>Log a Meal</Text>
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
        </View>
        <Pressable style={styles.submit} onPress={async () => {
          const newData = await addMeal({calories, protein, date});
          if (newData) {
            setMeals(prev => [...prev, ...newData]); // update state        
        }}}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>

      <View style={[{marginBottom: 20}]}>
        {meals.slice().reverse().map((data, index) =>
          <MealDisplay key={index} index={meals.length-index-1} calories={data.calories} protein={data.protein} date={data.date} onDelete={deleteRow}/>
        )}
      </View>
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