import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native';
import WeightDisplay from '../items/weight-display'
import Graph from '../items/graph';


export default function WeighIns() {
  const dateData = new Date()
  console.log(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear())
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());
  
  {/* Change this once the backend is done */}
  const weights = [[180,"10-01-2025"],[182,"10-02-2025"],[185,"10-03-2025"],[183,"10-04-2025"],[180,"10-05-2025"],[182,"10-06-2025"],[185,"10-07-2025"],[187,"10-08-2025"],[184,"10-09-2025"],[182,"10-10-2025"],[180,"10-11-2025"],[183,"10-12-2025"],[185,"10-13-2025"],[182,"10-14-2025"],[180,"10-15-2025"],[183,"10-16-2025"],[186,"10-17-2025"],[184,"10-18-2025"],[182,"10-19-2025"],[185,"10-20-2025"],[187,"10-21-2025"],[184,"10-22-2025"],[182,"10-23-2025"],[185,"10-24-2025"],[183,"10-25-2025"]];
  const weightData = averageWeights(weights)
  const graphData = weightData.map((array) => ({x: array[1], y: array[0]}));
  console.log(weightData)

  return(
    <ScrollView contentContainerStyle={styles.page}>
      <Graph data={graphData}/>
      <View style={styles.bottomContainer}>
        {/* This is to add another weigh in to the log */}
        <Text style={styles.title}>Log a Weigh In</Text>
        <View style={styles.addContainer}>
          <Text style={styles.label}>Weight</Text>
          <TextInput 
            defaultValue={weightData.length > 0 ? weightData[weightData.length-1][0] : 185}
            style={[styles.textbox, {width: 90}]}/>
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
        {weights.map((array, index) =>
          <WeightDisplay key={index} weight={array[0]} date={array[1]}/>
        )}
      </View>
    </ScrollView> 
  )
}

function averageWeights(weights) {
  const totals = {};
  const times = {}
  weights.forEach(([weight, date]) => {
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