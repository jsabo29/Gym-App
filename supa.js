import { SUPABASE_URL, SUPABASE_KEY } from '@env'
import { useEffect } from 'react'
import * as FileSystem from 'expo-file-system/legacy'
import { createClient, processLock } from '@supabase/supabase-js'
import { AppState, Platform, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-url-polyfill/auto'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  }})
if (Platform.OS !== "web") {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}

export const getUserId = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}
export const getUserEmail = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.email ?? null
}
export async function fetchWeighIns() {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('weigh_ins')
    .select('weight, date, id')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching weigh-ins:', error.message)
    return []
  }

  return data
}
export async function addWeight({weight, date}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('weigh_ins')
    .insert([
      {
        user_id: userId,
        weight,
        date,
      },
    ])
    .select()

  if (error) {
    console.error('Error inserting weigh-in:', error.message)
    return null
  }

  console.log('Inserted row:', data)
  return data
}
export async function removeWeight({id}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('weigh_ins')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // delete where id matches

  if (error) {
    console.error('Error deleting weigh-in:', error.message);
    return null;
  }

  console.log('Deleted row:', data);
  return data;
}
export async function fetchMeals() {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('meals')
    .select('calories, protein, date, id')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching meals:', error.message)
    return []
  }

  return data
}
export async function addMeal({calories, protein, date}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('meals')
    .insert([
      {
        user_id: userId,
        calories: calories,
        protein: protein,
        date: date,
      },
    ])
    .select()

  if (error) {
    console.error('Error inserting meal:', error.message)
    return null
  }

  console.log('Inserted row:', data)
  return data
}
export async function removeMeal({id}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // delete where id matches

  if (error) {
    console.error('Error deleting meal:', error.message);
    return null;
  }

  console.log('Deleted row:', data);
  return data;
}
export async function fetchLifts() {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('lifts')
    .select('movement, sets, reps, weight, date, id')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching lifts:', error.message)
    return []
  }

  return data
}
export async function addLift({movement, sets, reps, weight, date}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('lifts')
    .insert([
      {
        user_id: userId,
        reps: reps,
        sets: sets,
        weight: weight,
        movement: movement,
        date: date,
      },
    ])
    .select()

  if (error) {
    console.error('Error inserting lift:', error.message)
    return null
  }

  console.log('Inserted row:', data)
  return data
}
export async function removeLift({id}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }

  const { data, error } = await supabase
    .from('lifts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // delete where id matches

  if (error) {
    console.error('Error deleting lift:', error.message);
    return null;
  }

  console.log('Deleted row:', data);
  return data;
}
export async function signInWithEmail({email, password}) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  return error
}
export async function signUpWithEmail({email, password, name}) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: name,
      },
    },
  })
  if (!session) Alert.alert('Please check your inbox for email verification!')
  return error
}
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error.message)
    return error
  }
  return null
}
export async function addFriend(friendEmail) {
  //make sure all the data is in order
  if (friendEmail == null) {
    console.error('Friend email is null')
    return []
  }
  const userEmail = await getUserEmail()
  if (!userEmail) {
    console.error('No user email found. User might not be logged in.')
    return []
  }
  if (userEmail == friendEmail) {
    console.error('You cannot friend yourself.')
    return []
  }
  if (!(await userExists(friendEmail))) {
    console.error('This user does not exist.')
    return []
  }

  //see if the friendship already exists
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('user_email', userEmail)
    .eq('friend_email', friendEmail)
  if (error) {
    console.error('Error adding friend:', error1.message)
    return []
  }
  else if (data.length > 0) {
    console.log(data)
    acceptFriend({friendEmail})
    return []
  }

  //create new friendship
  const { data1, error1 } = await supabase
    .from('friends')
    .insert([
      {
        user_email: userEmail,
        friend_email: friendEmail,
        accepted: true
      },
    ])
    .select()
  if (error1) {
    console.error('Error adding friend:', error1.message)
    return []
  }
  const { data2, error2 } = await supabase
    .from('friends')
    .insert([
      {
        user_email: friendEmail,
        friend_email: userEmail,
        accepted: false
      },
    ])
    .select()
  if (error2) {
    console.error('Error adding friend:', error2.message)
    return []
  }

  return data1, data2
}
export async function getFriends(){
  const userEmail = await getUserEmail()
  if (!userEmail) {
    console.error('No user email found. User might not be logged in.')
    return []
  }
  const { data, error } = await supabase
    .from('friends')
    .select('friend_email, accepted')
    .eq('user_email', userEmail)

  if (error) {
    console.error('Error fetching friends:', error.message)
    return []
  }

  return data
}
export async function acceptFriend(friendEmail){
  const userEmail = await getUserEmail()
  if (!userEmail) {
    console.error('No user email found. User might not be logged in.')
    return []
  }
  if (userEmail == friendEmail) {
    console.error('You cannot friend yourself.')
    return []
  }
  const { data: data1, error: error1 } = await supabase
    .from('friends')
    .select('id')
    .eq('user_email', friendEmail)
    .eq('friend_email', userEmail)
    .eq('accepted', true)
  if (error1) {
    console.error('Error finding friend:', error1.message)
    return []
  }
  if (data1.length == 0 || data1 == null) {
    console.error('Friend has not added you yet.')
    return []
  }
  const { data: data2, error: error2 } = await supabase
    .from('friends')
    .update({accepted: true})
    .eq('user_email', userEmail)
    .eq('friend_email', friendEmail)
    .eq('accepted', false)
    .select()
  if (error2 || data2.length == 0) {
    console.error('Error adding friend')
    return []
  }

  return {data1, data2};
}
export async function removeFriend(friendEmail){
  const userEmail = await getUserEmail()
  if (!userEmail) {
    console.error('No user email found. User might not be logged in.')
    return []
  }
  if (userEmail == friendEmail) {
    console.error('You cannot friend yourself.')
    return []
  }
  const { data: data1, error: error1 } = await supabase
    .from('friends')
    .select('id')
    .eq('user_email', userEmail)
    .eq('friend_email', friendEmail)
    .eq('accepted', true)
  if (error1) {
    console.error('Error finding friend:', error1.message)
    return []
  }
  if (data1.length == 0 || data1 == null) {
    console.error('You have not added this person yet.')
    return []
  }
  const { data: data2, error: error2 } = await supabase
    .from('friends')
    .update({accepted: false})
    .eq('user_email', userEmail)
    .eq('friend_email', friendEmail)
    .eq('accepted', true)
    .select()
  if (error2 || data2.length == 0) {
    console.error('Error adding friend')
    return []
  }

  return {data1, data2};
}
export async function userExists(email) {
  if (!email) return false;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Error checking user:', error);
    return false;
  }

  return !!data;
}
export async function getFriendInfo(friendEmail) {
  //want to know if the friend request has been accepted, or pending which direction
  //want to know workout streak of the user 
  //want to know the display name of the user
  const userEmail = await getUserEmail()
  if (!userEmail) {
    console.error('No user email found. User might not be logged in.')
    return []
  }
  const { data: acceptedByUser, error: error1 } = await supabase
    .from('friends')
    .select('accepted')
    .eq('user_email', userEmail)
    .eq('friend_email', friendEmail)

  if (error1|| acceptedByUser.length != 1) {
    console.error('Error fetching friend info:', error1.message)
    return []
  }
  const { data: acceptedByFriend, error: error2 } = await supabase
    .from('friends')
    .select('accepted')
    .eq('user_email', friendEmail)
    .eq('friend_email', userEmail)
    
  if (error2 || acceptedByFriend.length != 1) {
    console.error('Error fetching friend info:', error2.message)
    return []
  }
  const { data: username, error: error } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('email', friendEmail)

  if (error|| username.length != 1) {
    console.error('Error fetching friend info:', error);
    return false;
  }
  const streak = await getStreak(friendEmail)
  return {
    acceptedByUser: acceptedByUser[0].accepted,
    acceptedByFriend: acceptedByFriend[0].accepted,
    displayName: username[0].display_name,
    streak: streak
  }
}
export async function getStreak(email) {
  //fetch lifts
  const { data: userId, error: error1 } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)

  if (error1 || userId.length != 1) {
    console.error('Error fetching friend info:', error1);
    return false;
  }
  const { data: lifts, error: error2 } = await supabase
    .from('lifts')
    .select('date')
    .eq('user_id', userId[0].id)
    .order('date', { ascending: true })

  if (error2) {
    console.error('Error fetching lifts:', error2.message)
    return []
  }
  if (!lifts || lifts.length === 0) return 0;

  // Convert dates to unique days (YYYY-MM-DD)
  const uniqueDates = [
    ...new Set(lifts.map(l => new Date(l.date).toISOString().split('T')[0]))
  ].sort((a, b) => new Date(b) - new Date(a));

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Helper: date → "YYYY-MM-DD"
  const fmt = d => d.toISOString().split('T')[0];

  let streak = 0;
  let current = new Date(today);

  // Check if they lifted today
  if (uniqueDates.includes(fmt(today))) {
    streak++;
    current = new Date(yesterday); // start checking from yesterday
  } else {
    current = new Date(yesterday);
  }

  // Check consecutive days before current
  while (uniqueDates.includes(fmt(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}
export async function uploadImage(imageUri) {
  try {
    if (!imageUri) return null

    // 1. Fetch the local file as arrayBuffer
    const response = await fetch(imageUri)
    const arrayBuffer = await response.arrayBuffer()

    // 2. Convert to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer)

    // 3. Generate file name
    const ext = imageUri.split('.').pop() || 'jpg'
    const filePath = `${Date.now()}.${ext}`
    const contentType = `image/${ext}`

    // 4. Upload to Supabase
    const { data, error } = await supabase.storage
      .from('recipe_images')
      .upload(filePath, uint8Array, {
        contentType,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // 5. Get public URL
    const { data: publicData } = supabase.storage
      .from('recipe_images')
      .getPublicUrl(filePath)

    console.log('Public URL:', publicData.publicUrl)

    return { path: filePath, url: publicData.publicUrl }

  } catch (err) {
    console.error('uploadImage() crashed:', err)
    return null
  }
}
export async function addRecipe({image, title, calories, protein, servings, time, ingredients, instructions}) {
  const userId = await getUserId()
  if (!userId) {
    console.error('No user ID found. User might not be logged in.')
    return []
  }
  if (!image) {
    console.error('No image uploaded.')
    return []
  }
  const { data: username, error: error1 } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', userId)

  if (error1|| username.length != 1) {
    console.error('Error fetching user info:', error1);
    return false;
  }
  const { path, url } = await uploadImage(image)
  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        user_id: userId,
        display_name: username[0].display_name,
        title: title,
        calories: calories,
        protein: protein,
        servings: servings,
        time: time,
        ingredients: ingredients,
        instructions: instructions,
        image_url: url
      },
    ])
    .select()

  if (error) {
    console.error('Error inserting recipe:', error.message)
    return null
  }
  return data
}
export async function fetchRecipes() {
  try {
    // 1. Fetch all recipes
    const { data, error } = await supabase
      .from('recipes') // your recipes table
      .select('*')   // fetch all columns

    if (error) {
      console.error('Error fetching recipes:', error)
      return []
    }

    // 2. Map data so images are ready for React Native
    const formattedData = data.map(recipe => ({
      ...recipe,
      image: recipe.image_url
        ? { uri: recipe.image_url } // React Native expects { uri: '...' }
        : null
    }))

    return formattedData

  } catch (err) {
    console.error('fetchRecipes crashed:', err)
    return []
  }
}