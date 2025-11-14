import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import {useState} from 'react'

export default function Recipe({data}) {
  const [showData, changeShowData] = useState(false);
  return (
    <Pressable style={styles.mainContainer} onPress={() => changeShowData(!showData)}>
      <View style={styles.imageDiv}>
        <Image style={styles.recipeImage} source={data.image}/>
      </View>
      <Text style={styles.title}>{data.title}: Serves {data.servings}</Text>
      {showData && 
      <View>
        <View style={{justifyContent: 'space-around', flexDirection: 'row', margin: 5}}>
          <Text style={styles.infoText}>Calories: {data.calories}</Text>
          <Text style={styles.infoText}>Protein: {data.protein}g</Text>
          <Text style={styles.infoText}>Time: {data.prepTime}g</Text>
        </View>
        <Text style={styles.titleText}>Ingredients</Text>
        {data.ingredients.map((ingredient, index) =>
          <Text style={styles.infoText} key={index}>- {ingredient}</Text>
        )}
        <Text style={styles.titleText}>Instructions</Text>
        {data.instructions.map((step, index) =>
          <Text style={styles.infoText} key={index}>- {step}</Text>
        )}
      </View>
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    maxWidth: 600,
    width: '90%',
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#25272D',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    margin: 10,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    border: 'none',
    borderRadius: 8,
  },
  imageDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    aspectRatio: 1
  },
  title: {
    color: '#EEF1EF',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: '10%',
    marginRight: '10%'
  },
  infoText: {
    fontSize: 14,
    color: '#EEF1EF',
    textAlign: 'left',
    margin: 3,
  },
  titleText: {
    fontSize: 16,
    color: '#EEF1EF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
  }
})