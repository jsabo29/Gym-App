import {View, Pressable, TextInput, Text, StyleSheet, Dimensions, Image} from 'react-native'
import {useState, useEffect} from 'react'

import {signInWithEmail, signUpWithEmail, getUserId} from '../supa.js'

export default function Authentication({navigation}) {
  useEffect(() => {
    // Check if a session already exists when the screen mounts
    (async () => {
      const userId = await getUserId()
      if (userId) navigation.navigate("Home")
    })()
  }, [])
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
  const aspectRatio = windowWidth/windowHeight

  const [signUpSelected, setSignUpSelected] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <View style={[styles.mainView, {justifyContent: aspectRatio>0.8 ? 'center' : 'flex-start', paddingTop: aspectRatio>0.8 ? 0 : '20%'}]}>
      <View style={[styles.secondView, {width: Math.min(500, windowWidth*0.9)}]}>
        <Text style={styles.titleText}>{signUpSelected ? "Sign Up" : "Log In"}</Text>
        <View style={styles.toggleView}>
          <Pressable onPress={()=> setSignUpSelected(true)} style={[styles.toggleButton, {backgroundColor: signUpSelected ? '#535765' : '#373A43',}]}>
            <Text style={{
              color: signUpSelected ? '#EEF1EF' : '#535765', 
              fontSize: 15, 
              fontWeight: signUpSelected ? 'bold' : '400', 
              userSelect: 'none'}}>Sign Up</Text>
          </Pressable>
          <Pressable onPress={()=> setSignUpSelected(false)} style={[styles.toggleButton, {backgroundColor: signUpSelected ? '#373A43': '#535765',}]}>
            <Text style={{
              color: signUpSelected ? '#535765' : '#EEF1EF', 
              fontSize: 15, 
              fontWeight: signUpSelected ? '400' : 'bold', 
              userSelect: 'none'}}>Log In</Text>
          </Pressable>
        </View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <View style={[styles.inputView]}>
          <Image source={require('../assets/Email.png')} style={styles.icon}/>
          <Text style={styles.separator}> | </Text>
          <View style={{flex: 1}}>
            <Text style={styles.promptText}>Email Address</Text>
            <TextInput 
              value={email ?? ''}
              onChangeText={setEmail}
              style={styles.textbox}/>
          </View>
        </View>
        <View style={[styles.inputView]}>
          <Image source={require('../assets/Lock.png')} style={styles.icon}/>
          <Text style={styles.separator}> | </Text>
          <View style={{flex: 1}}>
            <Text style={styles.promptText}>Enter Password</Text>
            <TextInput 
                value={password ?? ''}
                onChangeText={setPassword}
                style={styles.textbox}/>
          </View>
        </View>
        {signUpSelected && 
        <View style={[styles.inputView]}>
          <Image source={require('../assets/Lock.png')} style={styles.icon}/>
          <Text style={styles.separator}> | </Text>
          <View style={{flex: 1}}>
            <Text style={styles.promptText}>Confirm Password</Text>
            <TextInput 
                value={confirmPassword ?? ''}
                onChangeText={setConfirmPassword}
                style={styles.textbox}/>
          </View>
        </View>}
        <Pressable style={styles.loginButton} disabled={loading} onPress={signUpSelected ? signup : login}>
          {loading || <Text style={styles.loginText}>{signUpSelected ? "Sign Up" : "Log In"}</Text>}
          {loading && <Image source={require('../assets/loading.webp')} style={styles.icon}/>}
        </Pressable>
      </View>
    </View>
  )
  async function login() {
    try {
      setLoading(true)
      setErrorMessage('')

      const error = await signInWithEmail({ email, password })

      if (error) {
        setErrorMessage(error.message)
      } else {
        const userId = await getUserId()
        if (userId) {
          console.log(userId)
          navigation.navigate("Home")
        }
        else setErrorMessage("Login failed. Please try again.")
      }
    } catch (err) {
      setErrorMessage("Unexpected error occurred. Try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function signup() {
    if (confirmPassword !== password && signUpSelected) {
      setErrorMessage('Passwords do not match.')
      setConfirmPassword('')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')

      const error = await signUpWithEmail({ email, password })

      if (error) {
        setErrorMessage(error.message)
      } else {
        const userId = await getUserId()
        if (userId) {
          console.log(userId)
          navigation.navigate("Home")
        } else {
          // for new users, supabase might require email verification first
          setErrorMessage("Check your email for a verification link.")
        }
      }
    } catch (err) {
      setErrorMessage("Unexpected error occurred. Try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#000",
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondView: {
    backgroundColor: '#25272D',
    borderWidth: 1,
    borderColor: '#FF4B0A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3%'
  },
  toggleView: {
    backgroundColor: '#373A43',
    borderRadius: 6,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    padding: '0.8%'
  },
  toggleButton: {
    borderRadius: 6,
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: "#EEF1EF",
    fontSize: 50,
    fontWeight: 'bold',
    margin: '1%',
  },
  icon: {
    width: 25,
    height: 25,
    objectFit: 'cover',
    userSelect: 'none'
  },
  textbox: {
    padding: 4,
    backgroundColor: '#25272D',
    color: '#EEF1EF',
    fontSize: 16,
    marginRight: 6,
    outlineStyle: 'none'
  },
  inputView: {
    width: '80%',
    margin: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FF4B0A',
    padding: 5,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  separator:  {
    color: '#FF4B0A',
    fontSize: 25,
    fontWeight: '200',
    paddingBottom: 4.5,
    userSelect: 'none'
  },
  promptText: {
    marginLeft: 4,
    color: '#535765',
    fontSize: 10,
    userSelect: 'none'
  },
  loginButton: {
    backgroundColor: '#FF4B0A',
    height: 35,
    margin: 10,
    width: '30%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
    userSelect: 'none'
  },
  errorMessage: {
    color: '#e00f00',
    fontSize: 12,
    fontWeight: 'bold'
  },
})