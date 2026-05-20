import { supabase } from '../lib/supabase.js'

/**
 * Servicio de beats — habla con la tabla public.beats de Supabase.
 * Esquema: id, seller_id, seller_name, title, description, genre, type,
 * bpm, key, scale, release_date, cover_url, audio_preview_url, likes,
 * plays, price_standard, price_premium, price_exclusive, tags[], is_published.
 */
export const beatService = {
  /**
   * Lista pública de beats. Solo devuelve los publicados.
   * Filtros opcionales: genre, type, sellerId, limit, orderBy, ascending
   */
  async getAll({ genre, type, sellerId, limit = 50, orderBy = 'created_at', ascending = false } = {}) {
    let q = supabase
      .from('beats')
      .select('*')
      .eq('is_published', true)
      .order(orderBy, { ascending })
      .limit(parseInt(limit, 10))

    if (genre)    q = q.eq('genre', genre)
    if (type)     q = q.eq('type', type)
    if (sellerId) q = q.eq('seller_id', sellerId)

    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Beat no encontrado' }
    return data
  },

  /**
   * Beats de un vendedor concreto (incluye no publicados → uso del propio artista).
   */
  async getBySeller(sellerId) {
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getPopular(limit = 8) {
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .eq('is_published', true)
      .order('likes', { ascending: false })
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  /**
   * Búsqueda textual en title, description y genre.
   */
  async search(query, limit = 20) {
    if (!query) return []
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,genre.ilike.%${query}%`)
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async create(beat, sellerId, sellerName, client = supabase) {
    const payload = {
      ...beat,
      seller_id: sellerId,
      seller_name: sellerName || beat.seller_name || 'Unknown Artist'
    }
    const { data, error } = await client.from('beats').insert([payload]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async update(id, updates, userId, client = supabase) {
    const beat = await this.getById(id)
    if (beat.seller_id !== userId) throw { status: 403, message: 'No puedes editar este beat' }

    const { data, error } = await client
      .from('beats')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id, userId, client = supabase) {
    const beat = await this.getById(id)
    if (beat.seller_id !== userId) throw { status: 403, message: 'No puedes eliminar este beat' }

    const { error } = await client.from('beats').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  },

  async incrementLikes(id) {
    const { data, error } = await supabase.rpc('increment_beat_likes', { beat_id: id })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async incrementPlays(id) {
    const { data, error } = await supabase.rpc('increment_beat_plays', { beat_id: id })
    if (error) throw { status: 500, message: error.message }
    return data
  }
}
