import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, {useState} from 'react'
import Sidebar from "../items/sidebar"

export default function Home({navigation}) {
  const [showSidebar, changeShowSidebar] = new useState(false)
  return (
    <View style={styles.appContainer}>
      {showSidebar || 
      <Pressable style={styles.menuButton} onPress={() => changeShowSidebar(true)}>
        <Image style={styles.menuIcon} source={require('../assets/menu.png')}/>
      </Pressable>}
      {showSidebar && <Sidebar navigation={navigation} onClose={() => changeShowSidebar(false)}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  menuButton: {
    margin: 10,
    height: '7%',
    aspectRatio: 1,
  },
  menuIcon: {
    height: '100%',
    width: '100%',
    objectFit: 'fill'
  }
});