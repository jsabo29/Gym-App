import { StyleSheet, Text, View, Pressable} from 'react-native';
import { useState } from 'react';

export default function LiftDisplay({index, movement, weight, reps, sets, date, onDelete, width}){
  const [deleteIsPressed, changeDeleteIsPressed] = useState(false)
  const [viewIsPressed, changeViewIsPressed] = useState(false)
  return(
    <View style={[styles.wholeDiv, {width: width}]}>
      <View style={[styles.mainContainer, {justifyContent: deleteIsPressed ? 'center' : 'space-between'}]}>
        {!deleteIsPressed &&
        <Pressable onPress={() => changeViewIsPressed(!viewIsPressed)}>
          <Text style={[styles.data]}>{viewIsPressed ? 'Hide ' : 'View '} {date}</Text>
        </Pressable>}
        {!deleteIsPressed &&
        <View style={styles.deleteView}>
          <Pressable style={styles.deleteButton} onPress={() => changeDeleteIsPressed(true)}>
            <Text style={[styles.data, {color: '#EEF1EF'}]}>Delete</Text>
          </Pressable>
        </View>}
        {deleteIsPressed &&
        <View style={styles.deleteView}>
          <Pressable style={styles.confirmButton} onPress={() => {
            changeDeleteIsPressed(false);
            onDelete(index)}}>
            <Text style={[styles.data, {color: '#EEF1EF'}]}>Confirm</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => changeDeleteIsPressed(false)}>
            <Text style={styles.data}>Cancel</Text>
          </Pressable>
        </View>}
      </View>
      {viewIsPressed &&
      <View style={[styles.mainContainer, {justifyContent: 'center'}]}>
        <Text style={[styles.data, {fontSize: Math.min(30, width*0.07)}]}>{movement}</Text>
        <Text style={[styles.data, {fontSize: Math.min(30, width*0.07)}]}>{weight}</Text>
        <Text style={[styles.data, {fontSize: Math.min(30, width*0.07)}]}>{sets}x{reps}</Text>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  wholeDiv: {
    flexDirection: 'column',
    backgroundColor: '#25272D',
    borderWidth: 1,
    borderColor: '#FF4B0A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 2,
  },
  mainContainer: {
    margin: 2,
    width: '100%',
    height: 50,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  data: {
    fontSize: 30,
    userSelect: 'none',
    color: '#EEF1EF',
    marginLeft: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF4B0A',
    height: 40,
    border: 'none',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteView: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  confirmButton: {
    height: 40,
    backgroundColor: '#FF4B0A',
    border: 'none',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  cancelButton: {
    height: 40,
    backgroundColor: '#7D98A1',
    border: 'none',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
});