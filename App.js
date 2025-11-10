import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './pages/home';
import Auth from './pages/authentication'
import Meals from './pages/meals-wrapper';
import Workouts from './pages/workouts-wrapper';
import Weighins from './pages/weigh-ins-wrapper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
        <Stack.Screen name="Meals" component={Meals} options={{ headerShown: false }}/>
        <Stack.Screen name="Workouts" component={Workouts} options={{ headerShown: false }}/>
        <Stack.Screen name="Weigh-ins" component={Weighins} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
