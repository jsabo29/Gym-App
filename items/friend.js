import {StyleSheet, View, Image, Text, Pressable} from 'react-native'
import { getFriendInfo, acceptFriend, removeFriend } from '../supa';
import {useState, useEffect} from 'react'

export default function Friend( {email} ) {
  const [friendInfo, setFriendInfo] = useState({})
    useEffect(() => {
      getFriendInfo(email).then(setFriendInfo)
    }, []) 
  if (friendInfo.displayName) {
    return (
      <View style={styles.mainView}>
        <View style={styles.infoView}>
          <Text style={styles.nameText}>{friendInfo.displayName}</Text>
          <View style={styles.streakView}>
            <Text style={styles.streakText}>Gym Streak: {friendInfo.streak}</Text>
            <Image style={styles.streak} source={require('../assets/Streak.png')}/>
          </View>
        </View>
        {friendInfo.acceptedByFriend && !friendInfo.acceptedByUser &&
        <Pressable style={[styles.button, {backgroundColor: '#FF4B0A'}]} onPress={() => {
          acceptFriend(email)
          const newFriendInfo = {
            acceptedByUser: true,
            acceptedByFriend: friendInfo.acceptedByFriend,
            displayName: friendInfo.displayName,
            streak: friendInfo.streak}
          setFriendInfo(newFriendInfo)
          }}>
          <Text style={styles.buttonText}>Accept</Text>
        </Pressable>}
        {friendInfo.acceptedByFriend && friendInfo.acceptedByUser &&
        <Pressable style={[styles.button, {backgroundColor: 'red'}]} onPress={() => {
          removeFriend(email)
          const newFriendInfo = {
            acceptedByUser: false,
            acceptedByFriend: friendInfo.acceptedByFriend,
            displayName: friendInfo.displayName,
            streak: friendInfo.streak}
          setFriendInfo(newFriendInfo)
          }}>
          <Text style={styles.buttonText}>Remove</Text>
        </Pressable>}
        {!friendInfo.acceptedByFriend && friendInfo.acceptedByUser &&
        <Pressable disabled={true} style={[styles.button, {backgroundColor: 'yellow'}]}>
          <Text style={[styles.buttonText, {color: 'black'}]}>Pending</Text>
        </Pressable>}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    margin: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 5,
    borderColor: '#FF4B0A',
    borderWidth: 1,
    height: 50,
  },
  infoView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 2
  },
  streakView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2
  },
  streak: {
    width: 16,
    height: 16,
  },
  nameText: {
    color: '#EEF1EF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakText: {
    color: '#EEF1EF',
    fontSize: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
    borderRadius: 4,
    marginLeft: 4
  },
  buttonText: {
    color: '#EEF1EF',
    fontSize: 16,
    fontWeight: 'bold',
    userSelect: 'none'
  }
})