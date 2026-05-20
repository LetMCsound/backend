import { supabase } from '../lib/supabase.js'

export const musicianService = {
  async getAll({ genre } = {}) {
    let q = supabase.from('musicians').select('*').order('followers', { ascending: false })
    if (genre && genre !== 'All') q = q.eq('genre', genre)
    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('musicians')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Musician no encontrado' }
    return data
  }
}
