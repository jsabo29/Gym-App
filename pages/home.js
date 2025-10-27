import { StyleSheet, Text, View, Pressable } from 'react-native';
import Sidebar from "../items/sidebar"

export default function Home({navigation}) {
  return (
    <View style={styles.appContainer}>
      <Sidebar navigation={navigation}></Sidebar>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
});