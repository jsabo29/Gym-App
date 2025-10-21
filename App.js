import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function App() {
  return (
    <View style={styles.appContainer}>
      {/*sidebar -- gonna export this to another file later*/}
      <View style={styles.redirectContainer}>
        <Pressable style={styles.redirectButton}>
          <Text style={styles.buttonText}>Workouts</Text>
        </Pressable>
        <Pressable style={styles.redirectButton}>
          <Text style={styles.buttonText}>Meals</Text>
        </Pressable>
        <Pressable style={styles.redirectButton}>
          <Text style={styles.buttonText}>Weigh-Ins</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  redirectContainer: {
    width: '10%',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#A9B4C2',
  },
  redirectButton: {
    backgroundColor: '#FF4B0A',
    borderRadius: '10%',
    margin: '3%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
  },
  buttonText: {
    color: '#EEF1EF',
    fontSize: '100%',
  }
});