import { supabase } from '../lib/supabase.js'

export const lyricsService = {
  async getAll({ genre } = {}) {
    let q = supabase.from('lyrics').select('*').order('created_at', { ascending: false })
    if (genre && genre !== 'All') q = q.eq('genre', genre)
    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('lyrics')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Lyric no encontrado' }
    return data
  },

  async create(lyric) {
    const { data, error } = await supabase.from('lyrics').insert([lyric]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('lyrics').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  }
}
