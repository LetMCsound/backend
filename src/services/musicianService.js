import { supabase } from '../lib/supabase.js'

/**
 * Servicio de musicians — tabla public.musicians
 * Esquema: id, user_id, name, slug, bio, location, avatar_url, cover_url,
 * categories[], link_youtube, link_soundcloud, link_instagram, link_spotify,
 * followers, total_beats, is_verified, is_published.
 */
export const musicianService = {
  async getAll({ category, location, limit = 50 } = {}) {
    let q = supabase
      .from('musicians')
      .select('*')
      .eq('is_published', true)
      .order('followers', { ascending: false })
      .limit(parseInt(limit, 10))

    if (category) q = q.contains('categories', [category])
    if (location) q = q.ilike('location', `%${location}%`)

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
    if (!data) throw { status: 404, message: 'Músico no encontrado' }
    return data
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('musicians')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Músico no encontrado' }
    return data
  },

  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('musicians')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async update(id, updates, userId) {
    const musician = await this.getById(id)
    if (musician.user_id !== userId) throw { status: 403, message: 'No puedes editar este perfil' }

    const { data, error } = await supabase
      .from('musicians')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async search(query, limit = 20) {
    if (!query) return []
    const { data, error } = await supabase
      .from('musicians')
      .select('*')
      .eq('is_published', true)
      .or(`name.ilike.%${query}%,bio.ilike.%${query}%,location.ilike.%${query}%`)
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  }
}
