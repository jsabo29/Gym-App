import { StyleSheet, Text, View} from 'react-native';

export default function LiftDisplay({width}){
  return(
    <View style={[styles.wholeDiv, {width: width}]}>
      <View style={[styles.mainContainer, {justifyContent: 'center'}]}>
        <Text style={[styles.data]}>Enter More Data</Text>
      </View>
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
});