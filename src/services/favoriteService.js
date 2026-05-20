import { supabase } from '../lib/supabase.js'

/**
 * Servicio de favoritos — tabla public.favorites
 * Esquema: id, user_id, content_id, content_type ('beat' | 'lyric' | 'film' | 'graphic'), created_at
 */
export const favoriteService = {
  async isFavorite(userId, contentId, client = supabase) {
    const { data, error } = await client
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    return !!data
  },

  async add(userId, { contentId, contentType }, client = supabase) {
    const { data, error } = await client
      .from('favorites')
      .insert([{ user_id: userId, content_id: contentId, content_type: contentType }])
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(userId, contentId, client = supabase) {
    const { error } = await client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  },

  async getByUser(userId, contentType = null, client = supabase) {
    let q = client
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (contentType) q = q.eq('content_type', contentType)
    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  }
}
