import {Text, Pressable, View, TextInput, StyleSheet, ScrollView, Image, Platform} from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { addRecipe } from '../supa';

export default function Add( {navigation, userId} ) {
  const [image, setImage] = useState(null)
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [servings, setServings] = useState('')
  const [instructions, setInstructions] = useState([]) //the list of instructions
  const [instruction, setInstruction] = useState('') //the instructions the user is currently adding
  const [ingredients, setIngredients] = useState([]) //the list of ingredients
  const [ingredient, setIngredient] = useState('') //the ingredient the user is currently adding

  const pickImage = async () => {
    // For mobile platforms, ask for permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert("Permission required to pick images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#000'}} contentContainerStyle={[styles.mainView, {alignSelf: Platform.OS == 'ios' ? 'auto': 'center'}]}>
      <Text style={styles.title}>Upload A Recipe</Text>

      {/* Upload inputs */}

      {/* Image Upload */}
      {image && <Image source={{ uri: image }} style={styles.recipeImage} />}
      <Pressable onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>{image ? 'Change Image' : 'Upload Image'}</Text>
      </Pressable>
      {/* Title */}
      <View style={styles.addContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput 
          value={title ?? ''}
          onChangeText={setTitle}
          style={styles.textbox}/>
      </View>
      {/* Calories */}
      <View style={styles.addContainer}>
        <Text style={styles.label}>Calories</Text>
        <TextInput 
          value={calories ?? ''}
          onChangeText={setCalories}
          style={styles.textbox}/>
      </View>
      {/* Protein */}
      <View style={styles.addContainer}>
        <Text style={styles.label}>Protein (g)</Text>
        <TextInput 
          value={protein ?? ''}
          onChangeText={setProtein}
          style={styles.textbox}/>
      </View>
      {/* Servings */}
      <View style={styles.addContainer}>
        <Text style={styles.label}>Servings</Text>
        <TextInput 
          value={servings ?? ''}
          onChangeText={setServings}
          style={styles.textbox}/>
      </View>
      {/* Prep Time */}
      <View style={styles.addContainer}>
        <Text style={styles.label}>Prep Time</Text>
        <TextInput 
          value={time ?? ''}
          onChangeText={setTime}
          style={styles.textbox}/>
      </View>
      {/* Ingredient */}
      <View style={styles.listAddContainer}>
        <Text style={styles.label}>Ingredients</Text>
        <View style={styles.addContainer}>
          <TextInput 
            value={ingredient ?? ''}
            onChangeText={setIngredient}
            style={[styles.textbox]}/>
          <Pressable style={styles.addButton} onPress={() => {
            setIngredients(prev => [...prev, ingredient])
            setIngredient("")
          }}>
            <Image source={require('../assets/Plus.png')} style={styles.icon}/>
          </Pressable>
        </View>
      </View>
      {/* Ingredients List */}
      <View style={styles.listDisplayContainer}>
        {ingredients.map((value, index) => 
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.listText}>- {value}</Text>
            <Pressable onPress={() => setIngredients(prev => prev.filter((_, i) => i !== index))}>
              <Image style={styles.deleteIcon} source={require('../assets/Trash.png')}></Image>
            </Pressable>
          </View>
        )}
      </View>
      {/* Instruction */}
      <View style={styles.listAddContainer}>
        <Text style={styles.label}>Instructions</Text>
        <View style={styles.addContainer}>
          <TextInput 
            value={instruction ?? ''}
            onChangeText={setInstruction}
            style={[styles.textbox]}/>
          <Pressable style={styles.addButton} onPress={() => {
            setInstructions(prev => [...prev, instruction])
            setInstruction("")
          }}>
            <Image source={require('../assets/Plus.png')} style={styles.icon}/>
          </Pressable>
        </View>
      </View>
      {/* Instructions List */}
      <View style={styles.listDisplayContainer}>
        {instructions.map((value, index) => 
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.listText}>{index+1}. {value}</Text>
            <Pressable onPress={() => setInstructions(prev => prev.filter((_, i) => i !== index))}>
              <Image style={styles.deleteIcon} source={require('../assets/Trash.png')}></Image>
            </Pressable>
          </View>
        )}
      </View>

      <View style={{flexDirection: 'row'}}>
        <Pressable style={[styles.button, {width: 120}]} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload</Text>
        </Pressable>
        <Pressable style={[styles.button, {width: 120}]} onPress={()=> navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
  async function handleUpload() {
    await addRecipe({image, title, calories, protein, servings, time, ingredients, instructions})
  }
}
const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: '#EEF1EF',
    marginTop: 45,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  mainView: {
    padding: '1%',
    paddingBottom: 30,
    alignItems: "center",
    maxWidth: 650,
  },
  addContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textbox: {
    padding: 4,
    backgroundColor: '#25272D',
    color: '#EEF1EF',
    fontSize: 25,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FF4B0A',
    flex: 1
  },
  label: {
    marginLeft: 6,
    color: '#EEF1EF',
    fontSize: 30,
    fontWeight: 'bold',
    margin: 4,
  },
  listAddContainer: {
    flexDirection: 'column',
    margin: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    borderRadius: 6,
    height: 39.5,
    width: 39.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4B0A'
  },
  icon: {
    width: 30,
    height: 30,
    objectFit: 'cover'
  },
  deleteIcon: {
    width: 14,
    height: 14,
    objectFit: 'cover'
  },
  listDisplayContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    margin: 4
  },
  listText: {
    fontSize: 14,
    color: '#EEF1EF',
    textAlign: 'left',
    maxWidth: '90%'
  },
  button: {
    backgroundColor: '#FF4B0A',
    height: 39.5,
    borderRadius: 7,
    width: 220,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  buttonText: {
    fontSize: 25, 
    color: '#EEF1EF', 
    fontWeight: 'bold'
  },
  recipeImage: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: '3%'
  },
})