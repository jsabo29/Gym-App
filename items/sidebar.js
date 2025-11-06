import { StyleSheet, Text, View, Pressable, Image } from 'react-native';

export default function Sidebar({navigation, text}){

  return(
    <View style={[styles.redirectContainer, {paddingRight: text ? 60 : 0}, {width: text ? 250 : 80}]}>
      <Pressable style={styles.logo} onPress={() => navigation.navigate("Home")}>
        {!text && <Image source={require('../assets/Logo.png')} style={styles.icon}></Image>}
        {text && <Text style={styles.logoText}>GymBros</Text>}
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Workouts")}>
        <Image source={require('../assets/Lifts.png')} style={styles.icon}/>
        {text && <Text style={styles.buttonText}>Workouts</Text>}
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Meals")}>
        <Image source={require('../assets/Meals.png')} style={styles.icon}/>
        {text && <Text style={styles.buttonText}>Meals</Text>}
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Weigh-ins")}>
        <Image source={require('../assets/Scale.png')} style={styles.icon}/>
        {text && <Text style={styles.buttonText}>Weigh-Ins</Text>}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  redirectContainer: {
    height:'100%',
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    borderRightColor: '#555',
    borderRightWidth: 0.5,
  },
  redirectPressable: {
    borderRadius: 6,
    height: '5%',
    width: '100%',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonText: {
    userSelect: 'none',
    color: '#FF4B0A',
    fontSize: 24,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 20,
    objectFit: 'cover'
  },
  logo: {
    borderRadius: 6,
    height: '5%',
    width: '100%',
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 20,
    fontSize: 36,
    userSelect: 'none',
    color: '#FF4B0A',
  }
})