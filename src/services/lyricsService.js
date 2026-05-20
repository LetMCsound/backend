import { supabase } from '../lib/supabase.js'

/**
 * Servicio de lyrics — tabla public.lyrics
 * Esquema: id, seller_id, seller_name, title, description, genre, language,
 * content, cover_url, tags[], price_standard, price_premium, price_exclusive,
 * likes, is_published.
 */
export const lyricsService = {
  async getAll({ genre, language, limit = 50 } = {}) {
    let q = supabase
      .from('lyrics')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit, 10))

    if (genre)    q = q.eq('genre', genre)
    if (language) q = q.eq('language', language)

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
    if (!data) throw { status: 404, message: 'Letra no encontrada' }
    return data
  },

  async getBySeller(sellerId) {
    const { data, error } = await supabase
      .from('lyrics')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async search(query, limit = 20) {
    if (!query) return []
    const { data, error } = await supabase
      .from('lyrics')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,genre.ilike.%${query}%`)
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async create(lyric, sellerId, sellerName) {
    const payload = {
      ...lyric,
      seller_id: sellerId,
      seller_name: sellerName || lyric.seller_name || 'Unknown Artist'
    }
    const { data, error } = await supabase.from('lyrics').insert([payload]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async update(id, updates, userId) {
    const lyric = await this.getById(id)
    if (lyric.seller_id !== userId) throw { status: 403, message: 'No puedes editar esta letra' }

    const { data, error } = await supabase
      .from('lyrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id, userId) {
    const lyric = await this.getById(id)
    if (lyric.seller_id !== userId) throw { status: 403, message: 'No puedes eliminar esta letra' }

    const { error } = await supabase.from('lyrics').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  }
}
