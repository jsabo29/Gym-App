import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Sidebar({navigation}){

  return(
    <View style={styles.redirectContainer}>
      <LinearGradient colors={['#FF4B0A', '#df3c00ff']} style={styles.redirectButton}>
        <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Workouts")}>
          <Text style={styles.buttonText}>Workouts</Text>
        </Pressable>
      </LinearGradient>
      <LinearGradient colors={['#FF4B0A', '#df3c00ff']}  style={styles.redirectButton}>
        <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Meals")}>
          <Text style={styles.buttonText}>Meals</Text>
        </Pressable>
      </LinearGradient>
      <LinearGradient colors={['#FF4B0A', '#df3c00ff']} style={styles.redirectButton}>
        <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Weigh-ins")}>
          <Text style={styles.buttonText}>Weigh-Ins</Text>
        </Pressable>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  redirectContainer: {
    width: 200,
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#A9B4C2',
  },
  redirectButton: {
    backgroundColor: '#FF4B0A',
    borderRadius: 6,
    margin: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
  },
  redirectPressable: {
    borderRadius: 6,
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    userSelect: 'none',
    color: '#EEF1EF',
    fontSize: 24,
  },
})