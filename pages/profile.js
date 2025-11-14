import {Text, Pressable} from 'react-native'
import { signOut } from '../supa'

export default function User( {navigation, userId} ) {
  return(
    <Pressable onPress={(handleLogout)}>
      <Text>Log Out</Text>
    </Pressable>
  )
}
async function handleLogout() {
  const error = await signOut()
  if (!error) {
    navigation.navigate("Authentication")
  }
}