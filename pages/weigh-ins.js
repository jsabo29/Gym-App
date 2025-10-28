import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native';
import WeightDisplay from '../items/weight-display'
import Graph from '../items/graph';
import {fetchWeighIns, addWeight, removeWeight} from '../supa.js'

export default function WeighIns() {
  const dateData = new Date()
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());

  const [weights, setWeights] = useState([])
  useEffect(() => {
    fetchWeighIns().then(setWeights)
  }, [])
  const weightData = averageWeights(weights)
  const graphData = weightData.map((array) => ({x: array[1], y: array[0]}));
  const [weight, setWeight] = useState(weightData.length > 0 ? weightData[weightData.length-1][0] : 185)

  return(
    <ScrollView contentContainerStyle={styles.page}>
      <Graph data={graphData}/>
      <View style={styles.bottomContainer}>
        {/* This is to add another weigh in to the log */}
        <Text style={styles.title}>Log a Weigh In</Text>
        <View style={styles.addContainer}>
          <Text style={styles.label}>Weight</Text>
          <TextInput 
            id={"WeightTB"}
            value={weight ?? ''}
            style={[styles.textbox, {width: 70}]}
            onChangeText={setWeight}/>
          <Text style={styles.label}>Date</Text>
          <TextInput 
            id={"DateTB"}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#5E6572"
            keyboardType="numbers-and-punctuation"
            value={date ?? ''}
            onChangeText={setDate}
            style={[styles.textbox, {width: 170}]}/>
        </View>
        <Pressable style={styles.submit} onPress={async () => {
          const newData = await addWeight({ weight, date });
          if (newData) {
            setWeights(prev => [...prev, ...newData]); // update state
          }}}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>

      <View style={[{marginBottom: 20}]}>
        {weights.slice().reverse().map((data, index) =>
          <WeightDisplay key={index} index={weights.length-index-1} weight={data.weight} date={data.date} onDelete={deleteRow}/>
        )}
      </View>
    </ScrollView> 
  )

  function deleteRow(index) {
    removeWeight({id: weights[index].id})
    setWeights(prev => prev.filter((_, i) => i !== index))
  }
}

function averageWeights(weights) {
  const totals = {};
  const times = {}
  weights.forEach(({weight, date}) => {
    if (!times[date]) {
      times[date] = 1
      totals[date] = weight;
    }
    else {
      totals[date] = (totals[date]*times[date] + weight)/(times[date]+1);
      times[date] += 1;
    }
  });
  return Object.entries(totals).map(([date, weight]) => [
    weight,
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