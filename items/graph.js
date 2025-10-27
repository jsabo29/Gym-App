import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
      <VictoryChart theme={VictoryTheme ? VictoryTheme.material : undefined}>
        <VictoryAxis dependentAxis />
        <VictoryAxis fixLabelOverlap />
        <VictoryLine
          interpolation="natural"
          data={data}
          style={{ data: { stroke: '#FF4B0A', strokeWidth: 4 } }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    padding: 20,
    backgroundColor: '#A9B4C2',
    borderRadius: 20,
    margin: 20,
  },
});