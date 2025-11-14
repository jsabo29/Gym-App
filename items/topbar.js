import { StyleSheet, View, Pressable, TextInput, Image, Platform } from 'react-native';
import { useState } from 'react'
import { signOut } from '../supa';

export default function Topbar({navigation}){
  const [searchBar, setSearchBar] = useState('')
  return(
    <View style={[styles.redirectContainer, (Platform.OS === 'web'
      ? {
          position: 'fixed',
          top: 0,
          left: 0,
        }
      : {
          position: 'absolute',
          top: 0,
          left: 0,
          paddingTop: 32
        })]}>
      <Pressable style={styles.redirectPressable} onPress={() => navigation.navigate("Friends")}>
        <Image source={require('../assets/Users.png')} style={styles.icon}></Image>
      </Pressable>
      <View style={[styles.redirectPressable, {width: '60%'}]}>
        <TextInput 
          value={searchBar ?? ''}
          onChangeText={setSearchBar}
          style={styles.textbox}/>
      </View>
      <Pressable style={styles.redirectPressable} onPress={handleLogout}>
        <Image source={require('../assets/Logout.png')} style={styles.icon}/>
      </Pressable>
    </View>
  )
  async function handleLogout() {
  console.log('handling')
  const error = await signOut()
  if (!error) {
    console.log('navigating')
    navigation.navigate("Auth")
  }
  else{
    console.log('Error: ', error)
  }
}
}

const styles = StyleSheet.create({
  redirectContainer: {
    zIndex: 9999,
    width:'100%',
    paddingLeft: 40,
    paddingRight: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    backgroundColor: '#000',
    borderBottomColor: '#555',
    borderBottomWidth: 0.5,
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
    width: 30,
    height: 30,
    margin: 0,
    marginTop: 20,
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
  textbox: {
    padding: 4,
    backgroundColor: '#25272D',
    color: '#EEF1EF',
    fontSize: 18,
    fontWeight: '600',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FF4B0A',
    height: 40,
    margin: 0,
    marginTop: 20,
    width: '100%'
  },
})