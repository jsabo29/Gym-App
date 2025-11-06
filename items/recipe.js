import { View, StyleSheet, Image, Text, Pressable } from 'react-native';

export default function Recipe({data}) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageDiv}>
        <Pressable style={styles.imageToggleDiv}>
          <Text style={styles.imageToggle}>{'<'}</Text>
        </Pressable>
        <View style={styles.imageHolder}>
          <Image style={styles.recipeImage} source={data.image}/>
        </View>
        <Pressable style={styles.imageToggleDiv}>
          <Text style={styles.imageToggle}>{'>'}</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>{data.title}</Text>
      <Text>Calories: {data.calories}     Protein: {data.protein}g</Text>
      <Text>Ingredients</Text>
      <Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#EEF1EF',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
  },
  imageHolder: {
    width: '80%',
    aspectRatio: 1,
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
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imageToggle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  imageToggleDiv: {
    backgroundColor: '#A9B4C2',
    height: 20,
    width: 20,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
  }
})