import { StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { HoverEffect } from 'react-native-gesture-handler';

export default function MealDisplay({index, calories, protein, date, onDelete}){
  const [xIsPressed, changeXIsPressed] = useState(false)
  return(
    <View style={styles.mainContainer}>
      <Text style={[styles.data, {width: 90}]}>{calories}</Text>
      <Text style={[styles.data, {width: 60}]}>{protein}g</Text>
      <Text style={[styles.data, {width: 200}]}>{date}</Text>
      {!xIsPressed &&
      <View style={styles.deleteView}>
        <Pressable style={styles.x} onPress={() => changeXIsPressed(true)}>
          <Text style={[styles.data, {color: '#EEF1EF'}]}>Delete Entry</Text>
        </Pressable>
      </View>}
      {xIsPressed &&
      <View style={styles.deleteView}>
        <Pressable style={styles.confirmButton} onPress={() => {
          changeXIsPressed(false);
          onDelete(index)}}>
          <Text style={[styles.data, {color: '#EEF1EF'}]}>Confirm</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => changeXIsPressed(false)}>
          <Text style={styles.data}>Cancel</Text>
        </Pressable>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    margin: 1,
    backgroundColor: '#A9B4C2',
    width: '100%',
    height: 50,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  data: {
    userSelect: 'none',
    fontSize: 30,
    color: 'black',
    marginLeft: 10,
    marginRight: 10,
  },
  x: {
    width: 180,
    margin: 5,
    backgroundColor: '#FF4B0A',
    border: 'none',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteView: {
    width: 240,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  confirmButton: {
    width: 120,
    margin: 5,
    backgroundColor: '#FF4B0A',
    border: 'none',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButton: {
    width: 100,
    margin: 5,
    backgroundColor: '#7D98A1',
    border: 'none',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
});