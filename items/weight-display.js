import { StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, { useState } from 'react';

export default function WeightDisplay({weight, date}){
  const [xIsPressed, changeXIsPressed] = useState(false)
  return(
    <View style={styles.mainContainer}>
      <Text style={[styles.data, {width: 90}]}>{weight}</Text>
      <Text style={[styles.data, {width: 200}]}>{date}</Text>
      {!xIsPressed &&
      <Pressable style={styles.xButton} onPress={() => changeXIsPressed(!xIsPressed)}>
        <Image style={styles.x} source={require("../assets/x.png")}/>
      </Pressable>}
      {xIsPressed &&
      <Pressable style={styles.xButton} onPress={() => changeXIsPressed(!xIsPressed)}>
        <Image style={styles.x} source={require("../assets/x.png")}/>
      </Pressable>}
    </View>
  )
}

function handleDelete() {

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
    fontSize: 30,
    color: 'black',
    marginLeft: 10,
    marginRight: 10,
  },
  x: {
    width: 30,
    height: 30,
    objectFit: 'cover'
  },
  xButton: {
    width: 30,
    height: 30,
    margin: 5,
  },
})