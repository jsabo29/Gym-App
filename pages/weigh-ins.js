import React, {useState, useEffect} from 'react';
import { Dimensions, StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native';
import WeightDisplay from '../items/weight-display'
import Graph from '../items/graph';
import Bottombar from '../items/bottombar.js'
import Sidebar from '../items/sidebar.js'
import FillerDisplay from '../items/filler-display.js'
import {fetchWeighIns, addWeight, removeWeight} from '../supa.js'

export default function WeighIns( {navigation} ) {
  const dateData = new Date()
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());

  const [weights, setWeights] = useState([])
  useEffect(() => {
    fetchWeighIns().then(setWeights)
  }, [])
  const weightData = averageWeights(weights)
  const graphData = weightData.map((array) => ({x: array[1], y: array[0]}));
  const [weight, setWeight] = useState(weightData.length > 0 ? weightData[weightData.length-1][0] : 185)

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

  return(
    <ScrollView contentContainerStyle={[styles.page, {flexDirection: 1.2*windowHeight<windowWidth ? 'row' : 'column'}]}>

      {/* Sidebar and/or Bottombar */}
      {aspectRatio>1.2 && 
      <View style={{height: windowHeight}}>
        <Sidebar navigation={navigation} text={aspectRatio > 1.8}/>
      </View>
      }

      {/* Graph Data and Logging */}
      <ScrollView contentContainerStyle={[styles.page, {alignItems: 'center', justifyContent: 'flex-start', height: 1.2*windowHeight<windowWidth ? windowHeight : 'auto'}]}>
        <Graph data={graphData} size={Math.max(windowHeight*0.4, windowWidth*0.4)}/>
        <View style={styles.bottomContainer}>
          {/* This is to add another weigh in to the log */}
          <Text style={[styles.title, {fontSize: Math.min(50, windowWidth/9)}]}>Log a Weigh In</Text>
          {windowWidth > windowHeight &&
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
          </View>}
          {windowWidth <= windowHeight &&
          <View style={styles.rowContainer}>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Weight: </Text>
              <TextInput 
                id={"WeightTB"}
                value={weight ?? ''}
                style={[styles.textbox, {flex: 1}]}
                onChangeText={setWeight}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Date: </Text>
              <TextInput 
                id={"DateTB"}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#5E6572"
                keyboardType="numbers-and-punctuation"
                value={date ?? ''}
                onChangeText={setDate}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
          </View>}
          <Pressable style={styles.submit} onPress={async () => {
            const newData = await addWeight({ weight, date });
            if (newData) {
              setWeights(prev => [...prev, ...newData]); // update state
            }}}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Data List Displays */}
      {windowHeight>=windowWidth &&
      <View style={[{padding: 20, justifyContent: 'center', alignItems: 'center', paddingBottom: 100}]}>
        {weights.slice().reverse().map((data, index) =>
          <WeightDisplay key={index} index={weights.length-index-1} weight={data.weight} date={data.date} onDelete={deleteRow} width={windowWidth*0.95}/>
        )}
        {weights.length == 0 && <FillerDisplay width={windowWidth*0.95}/>}
      </View>}
      {windowHeight<windowWidth &&
      <View style={{height:windowHeight, alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: '#555'}}>
        <ScrollView contentContainerStyle={[{padding: 20, height:windowHeight, alignItems: 'center'}]}>
          {weights.slice().reverse().map((data, index) =>
            <WeightDisplay key={index} index={weights.length-index-1} weight={data.weight} date={data.date} onDelete={deleteRow} width={windowWidth*0.3}/>
          )}
          {weights.length == 0 && <FillerDisplay width={windowWidth*0.3}/>}
        </ScrollView>
      </View>}
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
    alignItems: "center"
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