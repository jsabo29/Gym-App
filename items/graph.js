import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Line } from 'react-native-svg';

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

export default function Graph({data, size}) {
  const graphDimension = size
  console.log('size: ' + size)

  const parsedData = data.map(d => ({
    x: new Date(d.x + 'T00:00:00Z'),
    y: d.y,
  }));

  const yValues = parsedData.map(d => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const padding = (maxY - minY) * 0.05;
  const domainY = [minY - padding, maxY + padding];
  console.log('VictoryChart:', VictoryChart);
  console.log('VictoryLine:', VictoryLine);
  console.log('VictoryAxis:', VictoryAxis);
  console.log('VictoryTheme:', VictoryTheme);
  return (
    <View style={[styles.container, {width: graphDimension}, {paddingTop: graphDimension*0.1}, {paddingBottom: graphDimension/20}, {paddingRight: graphDimension/20}, {paddingLeft: graphDimension/20}]}>
      {parsedData.length>1 &&
      <VictoryChart 
        width={graphDimension*0.9}
        height={graphDimension*0.9}
        theme={VictoryTheme?.material} 
        padding={{ top: 0, bottom: graphDimension/6, left: graphDimension/6, right: graphDimension/20 }}
        domain={{ y: domainY }}
        scale={{ x: 'time' }}
      >
        <VictoryAxis dependentAxis 
          style={{
            tickLabels: {fill: '#EEF1EF', fontSize: graphDimension/25},
            grid: { stroke: '#EEF1EF', strokeDasharray: '5,5' } // dotted horizontal lines
            }}
          gridComponent={<Line />}/> 
        <VictoryAxis 
          style={{
            tickLabels: { angle: -90, textAnchor: 'end', fill: '#EEF1EF', fontSize: graphDimension/25 },
            grid: { stroke: '#EEF1EF', strokeDasharray: '5,5' } // dotted horizontal lines
          }}
          gridComponent={<Line />}/>
        <VictoryLine
          interpolation="monotoneX"
          data={parsedData}
          style={{ data: { stroke: '#FF4B0A', strokeWidth: 4 } }}
        />
      </VictoryChart>}
      {data.length<=1 &&
      <Text style={[styles.defaultText, {fontSize: graphDimension/8}]}>Enter More Data</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    backgroundColor: '#25272D',
    borderRadius: 20,
    margin: 20,
    marginBottom: 0,
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FF4B0A'
  },
  defaultText: {
    color: '#EEF1EF',
  }
});