import { supabase } from '../lib/supabase.js'

/**
 * Servicio de films — tabla public.film_makers
 * Esquema similar a beats: seller_id, seller_name, title, description, genre,
 * cover_url, video_url, views, prices, tags, is_published, created_at.
 */
export const filmService = {
  async getAll({ genre, limit = 50 } = {}) {
    let q = supabase
      .from('film_makers')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit, 10))
    if (genre) q = q.eq('genre', genre)
    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('film_makers')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Film no encontrado' }
    return data
  },

  async getBySeller(sellerId) {
    const { data, error } = await supabase
      .from('film_makers')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async search(query, limit = 20) {
    if (!query) return []
    const { data, error } = await supabase
      .from('film_makers')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,genre.ilike.%${query}%`)
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async create(film, sellerId, sellerName) {
    const payload = { ...film, seller_id: sellerId, seller_name: sellerName || 'Unknown' }
    const { data, error } = await supabase.from('film_makers').insert([payload]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async update(id, updates, userId) {
    const film = await this.getById(id)
    if (film.seller_id !== userId) throw { status: 403, message: 'No puedes editar este film' }

    const { data, error } = await supabase
      .from('film_makers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id, userId) {
    const film = await this.getById(id)
    if (film.seller_id !== userId) throw { status: 403, message: 'No puedes eliminar este film' }
    const { error } = await supabase.from('film_makers').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  },

  async incrementViews(id) {
    const { data, error } = await supabase.rpc('increment_film_views', { film_id: id })
    if (error) throw { status: 500, message: error.message }
    return data
  }
}
