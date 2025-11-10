import { SUPABASE_URL, SUPABASE_KEY } from '@env'
import { useEffect } from 'react'
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
export async function signUpWithEmail({email, password}) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  })
  if (!session) Alert.alert('Please check your inbox for email verification!')
  return error
}