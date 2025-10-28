import { SUPABASE_URL, SUPABASE_KEY } from '@env'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const userId = 'Sample_ID_Will_Be_Auto_Generated_Later'

export async function fetchWeighIns() {
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
  const { data, error } = await supabase
    .from('weigh_ins')
    .delete()
    .eq('id', id); // delete where id matches

  if (error) {
    console.error('Error deleting weigh-in:', error.message);
    return null;
  }

  console.log('Deleted row:', data);
  return data;
}
export async function fetchMeals() {
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
  const { data, error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id); // delete where id matches

  if (error) {
    console.error('Error deleting meal:', error.message);
    return null;
  }

  console.log('Deleted row:', data);
  return data;
}