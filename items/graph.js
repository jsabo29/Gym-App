import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
let VictoryChart, VictoryLine, VictoryAxis, VictoryTheme;
if (Platform.OS === 'web') {
  // Web
  const victory = require('victory');
  VictoryChart = victory.VictoryChart;
  VictoryLine = victory.VictoryLine;
  VictoryAxis = victory.VictoryAxis;
  VictoryTheme = victory.VictoryTheme;
} else {
  // iOS / Android
  const victoryNative = require('victory-native');
  VictoryChart = victoryNative.VictoryChart;
  VictoryLine = victoryNative.VictoryLine;
  VictoryAxis = victoryNative.VictoryAxis;
  // VictoryTheme is not included in victory-native
  VictoryTheme = undefined;
}

export default function Graph({data}) {
  return (
    <View style={styles.container}>
      {data.length>1 &&
      <VictoryChart theme={VictoryTheme ? VictoryTheme.material : undefined} padding={{ top: 20, bottom: 80, left: 50, right: 20 }}>
        <VictoryAxis dependentAxis style={{tickLabels: {fill: '#5E6572'}}}/> 
        <VictoryAxis fixLabelOverlap style={{tickLabels: { angle: -90, textAnchor: 'end', fill: '#5E6572'}}}/>
        <VictoryLine
          interpolation="natural"
          data={data}
          style={{ data: { stroke: '#FF4B0A', strokeWidth: 4 } }}
        />
      </VictoryChart>}
      {data.length<=1 &&
      <Text style={styles.defaultText}>Enter More Data</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    aspectRatio: 1,
    padding: 20,
    backgroundColor: '#A9B4C2',
    borderRadius: 20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  defaultText: {
    color: '#5E6572',
    fontSize: 40
  }
});