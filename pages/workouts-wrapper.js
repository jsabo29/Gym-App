import React, {useState, useEffect} from 'react'
import Workouts from './workouts'
import Bottombar from '../items/bottombar';
import {Platform, View, KeyboardAvoidingView, Dimensions} from 'react-native'

export default function MealsWrapper( {navigation} ) {
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

  return (
  Platform.OS === 'web' ? 
  (<View style={{ flex: 1, backgroundColor: '#000' }}>
    <Workouts navigation={navigation}/>
    {aspectRatio<1.2 && <Bottombar navigation={navigation}/>}
  </View>) :
  (<View style={{ flex: 1, backgroundColor: '#000' }}>
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Workouts navigation={navigation}/>
    </KeyboardAvoidingView>
    {aspectRatio<1.2 && <Bottombar navigation={navigation}/>}
  </View>))
}