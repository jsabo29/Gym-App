import { StyleSheet, Text, View, Pressable, TextInput, Dimensions, ScrollView } from 'react-native';
import { getFriends, addFriend, acceptFriend } from '../supa';
import { useState, useEffect } from 'react'
import Friend from './friend';

export default function Friendbar(){
  //screen data
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  // Listen for window size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });
    return () => subscription?.remove();
  }, []);

  const [friends, setFriends] = useState([])
    useEffect(() => {
      getFriends().then(setFriends)
    }, []) 
  
  const [friendEmail, setFriendEmail] = useState('')
  return(
    <ScrollView contentContainerStyle={[styles.mainContainer, {height: windowHeight}]}>
      <Text style={styles.title}>Friends</Text>
      <Text style={styles.addFriend}>Add Friend Via Email</Text>
      <TextInput 
        value={friendEmail ?? ''}
        onChangeText={setFriendEmail}
        style={styles.textbox}/>
      <Pressable style={styles.submit} onPress={() => {
        addFriend(friendEmail).then(() => getFriends().then(setFriends))
        }}>
        <Text style={styles.submitText}>Add</Text>
      </Pressable>
      {friends.map((data, index) => (
        <Friend key={index} email={data.friend_email}/>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    paddingTop: 20,
    width: '100%'
  },
  title: {
    color: "#EEF1EF",
    fontSize: 35,
    fontWeight: 'bold',
    margin: 5,
  },
  addFriend: {
    color: '#EEF1EF',
    fontSize: 15,
    margin: 5,
  },
  textbox: {
    padding: 4,
    backgroundColor: '#25272D',
    color: '#EEF1EF',
    fontSize: 15,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FF4B0A',
    height: 30,
    width: '100%',
  },
  submit: {
    borderRadius: 5,
    width: '100%',
    margin: 5,
    height: 30,
    backgroundColor: '#FF4B0A',
    border: 'none',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    color: '#EEF1EF',
    fontWeight: 'bold',
    fontSize: 15,
    userSelect: 'none'
  },
})