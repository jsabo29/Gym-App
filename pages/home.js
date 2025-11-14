import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import {useState, useEffect} from 'react'

import Sidebar from "../items/sidebar"
import Recipe from "../items/recipe"
import Bottombar from "../items/bottombar"
import Friendbar from '../items/friendbar';
import Topbar from '../items/topbar'

export default function Home({navigation}) {
  const recipeData = getRecipeData();
  
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

  // if aspect ratio > 1.8 show sidebar menu, feed, friends
  // if aspect ratio > 1.6 show sidebar menu icons, feed, friends
  // if aspect ratio > 1.2 show sidebar menu icons, feed
  // if aspect ratio < 1.2 show bottom menu, feed
  // feed is recipe posts
  return (
    <View style={styles.appContainer}>
      {aspectRatio<1.2 && <Topbar navigation={navigation}/>}
      {aspectRatio>1.2 && 
      <View style={{height: windowHeight}}>
        <Sidebar navigation={navigation} text={aspectRatio > 1.8}/>
      </View>}
      {aspectRatio<1.2 && <Bottombar navigation={navigation}/>}
      {/* This is going to be the main feed for recipes */}
      <ScrollView style={{height: windowHeight, flex: 3}} scrollEnabled={true} contentContainerStyle={[styles.feed, {paddingTop: aspectRatio<1.2 ? 110 : 30}]}>
        <Recipe data={recipeData}/>
        <Recipe data={recipeData}/>
        <Recipe data={recipeData}/>
        <Recipe data={recipeData}/>
      </ScrollView>
      {aspectRatio>1.2 && 
      <View style={[styles.friendbarView, {height: windowHeight}]}>
        <Friendbar/>
      </View>}
    </View>
  );
}

function getRecipeData() {
  const recipeData = {};
  recipeData.image = require('../assets/sample-recipe-image.png');
  recipeData.calories = 600;
  recipeData.protein = 30;
  recipeData.servings = 4;
  recipeData.title = 'Pan-Seared Country Seasoned Chicken Breast with Butter Sauce';
  recipeData.prepTime = 30;
  recipeData.ingredients = ['2 Large chicken breasts', '30g unsalted butter', '1 tsp paprika', '1/2 tsp onion powder', '1/2 tsp garlic powder', '1/4 tsp cumin', '3/4 tsp cooking salt', '1/8 tsp black pepper', '1 1/2 tbsp flour', '1/3 cup dry white wine', '30g/ 2 tbsp unsalted butter', '1 tbsp roughly chopped parsley']
  recipeData.instructions = ['Mix the Seasoning ingredients in a bowl. Sprinkle on each side of the chicken, spreading with fingertips to coat evenly, then shake off excess.', 'Melt the butter in a large non-stick pan over high heat. Cook chicken for 2 1/2 minutes on each side until deep golden, or until the internal temperature reaches 67C/153F. Remove onto a plate.', 'Lower then heat to medium high. Add the wine and simmer rapidly for 1 – 1 1/2 minutes, scraping the pan with a rubber spatula to loosen the golden bits into the sauce, until it\'s reduced by half. Add the butter and let it melt, mixing well to combine.', 'Serve chicken with sauce and sprinkled with parsley. Enjoy!']
  return recipeData;
}

const styles = StyleSheet.create({
  appContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: '#000000',
    alignItems: 'flex-start',
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
  },
  feed: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 100
  },
  friendbarView: { 
    flex: 1,
    minWidth: 300, 
    backgroundColor: '#000', 
    borderLeftColor: '#555', 
    borderLeftWidth: 0.5,
  }
});