import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LiftDisplay from '../items/lift-display'
import Graph from '../items/graph';
import { toInteger } from 'lodash';
import {fetchLifts, addLift, removeLift} from '../supa.js'

export default function Workouts() {
  const [selectedValue, setSelectedValue] = useState("Bench");
  const dateData = new Date()
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());
  
  const [lifts, setLifts] = useState([])
  useEffect(() => {
    fetchLifts().then(setLifts)
  }, []) 
  const existingLifts = getExistingLifts(lifts);
  const volumes = getVolume(lifts, selectedValue).map((array) => ({x: array[1], y: array[0]}));
  console.log(volumes)

  //for textboxes
  const [movement, setMovement] = useState('Bench')
  const [reps, setReps] = useState(8)
  const [sets, setSets] = useState(3)
  const [weight, setWeight] = useState(225)

  return(
    <ScrollView contentContainerStyle={styles.page}>
      <Graph data={volumes}/>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Note: The graph displays volume (sets x reps x weight)</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Select Movement: </Text>
        <Picker 
          style={styles.graphPicker}
          selectedValue={selectedValue}
          dropdownIconColor="transparent"
          onValueChange={(itemValue) => setSelectedValue(itemValue)}>
            {existingLifts.map((mvmnt) => <Picker.Item label={mvmnt} value={mvmnt}/>)}
          </Picker>
      </View>
      <View style={styles.bottomContainer}>
        {/* This is to add another lift to the log */}
        <Text style={styles.title}>Log a Workout</Text>
        <View style={styles.rowContainer}>
          <View style={styles.addContainer}>
            <Text style={styles.label}>Movement</Text>
            <TextInput 
              value={movement ?? ''}
              onChangeText={setMovement}
              style={[styles.textbox, {width: 200}]}/>
            <Text style={styles.label}>Weight</Text>
            <TextInput 
              value={weight ?? ''}
              onChangeText={setWeight}
              style={[styles.textbox, {width: 130}]}/>
          </View>
          <View style={styles.addContainer}>
            <Text style={styles.label}>Sets</Text>
            <TextInput 
              value={sets ?? ''}
              onChangeText={setSets}
              style={[styles.textbox, {width: 50}]}/>
              <Text style={styles.label}>Sets</Text>
            <TextInput 
              value={reps ?? ''}
              onChangeText={setReps}
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
        </View>
        <Pressable style={styles.submit} onPress={async () => {
          const newData = await addLift({movement, sets, reps, weight, date});
          if (newData) {
            setLifts(prev => [...prev, ...newData]); // update state        
        }}}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>

      <View style={[{marginBottom: 20}]}>
        {lifts.slice().reverse().map((data, index) =>
          <LiftDisplay 
          key={index} 
          index={lifts.length-index-1} 
          sets={data.sets} 
          reps={data.reps} 
          movement={data.movement} 
          date={data.date} 
          weight={data.weight} 
          onDelete={deleteRow}/>
        )}
      </View>
    </ScrollView> 
  )
  function deleteRow(index) {
      removeLift({id: lifts[index].id})
      setLifts(prev => prev.filter((_, i) => i !== index))
    }
}

function getVolume(lifts, liftType) {
  const totals = {};

  lifts.forEach(({sets, reps, weight, date, movement}) => {
    if (movement == liftType) {
      if (!totals[date]) {
        totals[date] = {};
        totals[date].volume = 0;
      }
      totals[date].volume += sets*reps*weight;
    }});

  // Convert back to array form if needed:
  return Object.entries(totals).map(([date, { volume }]) => [
    volume,
    date
  ]);
}

function getExistingLifts(lifts) {
  const existing = [];
  lifts.forEach(({ movement }) => {
    if (!existing.includes(movement)) {
      existing.push(movement);
    }
  });
  if (existing.length == 0) {return ['Bench'];}
  return existing;
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
    userSelect: "none",
    justifyContent: 'center',
    alignItems: 'center'
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
    flexDirection: 'row',
    margin: 8,
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
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
})