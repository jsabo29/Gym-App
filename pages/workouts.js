import {useState, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View, Pressable, ScrollView, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import LiftDisplay from '../items/lift-display'
import Graph from '../items/graph';
import FillerDisplay from '../items/filler-display.js'
import Sidebar from '../items/sidebar.js';

import {fetchLifts, addLift, removeLift} from '../supa.js'

export default function Workouts({navigation}) {
  const [open, setOpen] = useState(false);
  const dateData = new Date()
  const [date, setDate] = useState(dateData.getMonth()+1 + '/' + dateData.getDate() + '/' + dateData.getFullYear());
  
  const [lifts, setLifts] = useState([])
  useEffect(() => {
    fetchLifts().then(setLifts)
  }, []) 
  const existingLifts = getExistingLifts(lifts);
  console.log('existingLifts: ' + existingLifts)
  const pickerItems = existingLifts.map(value => { return { label: value, value: value }; });
  console.log(pickerItems)
  const [selectedValue, setSelectedValue] = useState(pickerItems[0]?.value || "Bench");
  const volumes = getVolume(lifts, selectedValue).map((array) => ({x: array[1], y: array[0]}));

  //for textboxes
  const [movement, setMovement] = useState('Bench')
  const [reps, setReps] = useState(8)
  const [sets, setSets] = useState(3)
  const [weight, setWeight] = useState(225)

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
  const aspectRatio = windowWidth/windowHeight;

  return(
    <ScrollView contentContainerStyle={[styles.page, {flexDirection: 1.2*windowHeight<windowWidth ? 'row' : 'columm'}]}>

      {/* Sidebar and/or Bottombar */}
      {aspectRatio>1.2 && 
      <View style={{height: windowHeight}}>
        <Sidebar navigation={navigation} text={aspectRatio > 1.8}/>
      </View>
      }
      
      {/* Graph and Add Menu */}
      <ScrollView contentContainerStyle={[styles.page, {alignItems: 'center', justifyContent: 'flex-start', height: 1.2*windowHeight<windowWidth ? windowHeight : 'auto'}]}>
        <Graph data={volumes} size={Math.max(windowHeight*0.4, windowWidth*0.4)}/>
        <View style={[styles.textContainer, {marginTop: 0}]}>
          <Text style={[styles.text, {fontSize: 15}]}>Note: The graph displays volume (sets x reps x weight)</Text>
        </View>
        <View style={[styles.textContainer, {marginTop: 20}]}>
          <DropDownPicker
            open={open}
            value={selectedValue}
            items={pickerItems}
            setOpen={setOpen}
            setValue={setSelectedValue}
            containerStyle={{ width: 200 }}
            style={{ backgroundColor: '#FF4B0A' }}
            dropDownStyle={{ backgroundColor: '#FF4B0A' }}
            textStyle={{ color: '#000', fontSize: 20 }}
          />  
        </View>
        <View style={styles.bottomContainer}>
          {/* This is to add another lift to the log */}
          <Text style={[styles.title, {fontSize: Math.min(50, windowWidth/9)}]}>Log a Workout</Text>
          {windowHeight < windowWidth && 
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
              <Text style={styles.label}>Reps</Text>
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
          }
          {windowHeight >= windowWidth && 
          <View style={styles.rowContainer}>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Movement: </Text>
              <TextInput 
                value={movement ?? ''}
                onChangeText={setMovement}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Weight: </Text>
              <TextInput 
                value={weight ?? ''}
                onChangeText={setWeight}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Sets: </Text>
              <TextInput 
                value={sets ?? ''}
                onChangeText={setSets}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Reps: </Text>
              <TextInput 
                value={reps ?? ''}
                onChangeText={setReps}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
            <View style={styles.addContainer}>
              <Text style={styles.label}>Date: </Text>
              <TextInput 
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#5E6572"
                keyboardType="numbers-and-punctuation"
                value={date}
                onChangeText={setDate}
                style={[styles.textbox, {flex: 1}]}/>
            </View>
          </View>
          }
          <Pressable style={styles.submit} onPress={async () => {
            const newData = await addLift({movement, sets, reps, weight, date});
            if (newData) {
              setLifts(prev => [...prev, ...newData]); // update state        
            }}}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Data List Display */}
      {windowHeight>=windowWidth && 
      <View style={[{padding: 20, justifyContent: 'center', alignItems: 'center', paddingBottom: 100}]}>
        {lifts.slice().reverse().map((data, index) =>
          <LiftDisplay 
          key={index} 
          index={lifts.length-index-1} 
          sets={data.sets} 
          reps={data.reps} 
          movement={data.movement} 
          date={data.date} 
          weight={data.weight} 
          onDelete={deleteRow}
          width={windowWidth*0.95}/>
        )}
        {lifts.length == 0 && <FillerDisplay width={windowWidth*0.95}/>}
      </View>}
      {windowHeight<windowWidth &&
      <View style={{height:windowHeight, alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: '#555'}}>
        <ScrollView contentContainerStyle={[{padding: 20, height:windowHeight, alignItems: 'center'}]}>
          {lifts.slice().reverse().map((data, index) =>
            <LiftDisplay 
            key={index} 
            index={lifts.length-index-1} 
            sets={data.sets} 
            reps={data.reps} 
            movement={data.movement} 
            date={data.date} 
            weight={data.weight} 
            onDelete={deleteRow}
            width={windowWidth*0.3}/>
          )}
          {lifts.length == 0 && <FillerDisplay width={windowWidth*0.3}/>}
        </ScrollView>
      </View>}
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