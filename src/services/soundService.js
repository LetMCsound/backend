import { supabase } from '../lib/supabase.js'

export const soundService = {
  async getAll({ genre, section, limit } = {}) {
    let q = supabase.from('sounds').select('*').order('created_at', { ascending: false })
    if (genre && genre !== 'All') q = q.eq('genre', genre)
    if (section) q = q.eq('section', section)
    if (limit) q = q.limit(parseInt(limit, 10))

    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('sounds')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Sound no encontrado' }
    return data
  },

  async getTrending(limit = 4) {
    const { data, error } = await supabase
      .from('sounds')
      .select('*')
      .order('likes', { ascending: false })
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getRecent(limit = 4) {
    const { data, error } = await supabase
      .from('sounds')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async create(sound) {
    const { data, error } = await supabase.from('sounds').insert([sound]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('sounds')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('sounds').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  }
}
