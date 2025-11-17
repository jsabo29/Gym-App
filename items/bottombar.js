import { StyleSheet, View, Pressable, Image, Platform } from 'react-native';

export default function Bottombar({navigation}){

  return(
    <View style={[styles.container, (Platform.OS === 'web'
      ? {
          position: 'fixed',
          bottom: 0,
          left: 0,
        }
      : {
          position: 'absolute',
          bottom: 0,
          left: 0,
        })]}>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Friends")}>
        <Image source={require('../assets/Users.png')} style={styles.icon}></Image>
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Workouts")}>
        <Image source={require('../assets/Lifts.png')} style={styles.icon}/>
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Home")}>
        <Image source={require('../assets/Home.png')} style={[styles.icon, {height: 40, width: 40}]}></Image>
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Meals")}>
        <Image source={require('../assets/Meals.png')} style={styles.icon}/>
      </Pressable>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Weigh-ins")}>
        <Image source={require('../assets/Scale.png')} style={styles.icon}/>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    width:'100%',
    paddingLeft: 40,
    paddingRight: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#000',
    borderTopColor: '#555',
    borderTopWidth: 0.5,
  },
  redirectPressable: {
    borderRadius: 6,
    height: '100%',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    margin: 0,
    marginBottom: 20,
    objectFit: 'cover'
  },
  logo: {
    borderRadius: 6,
    height: '5%',
    width: '100%',
    marginTop: 60,
    marginBottom: 60,
    alignItems: 'center',
  },
})