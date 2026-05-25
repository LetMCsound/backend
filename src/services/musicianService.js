import { supabase, supabaseAdmin } from '../lib/supabase.js'

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

  async update(id, updates, userId, client = supabase) {
    const musician = await this.getById(id)
    if (musician.user_id !== userId) throw { status: 403, message: 'No puedes editar este perfil' }

    const { data, error } = await client
      .from('musicians')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }

    // Si el nombre cambió, propagarlo a comentarios y contenido publicado
    if (updates.name && updates.name !== musician.name) {
      const newName = updates.name
      // supabaseAdmin bypasses RLS — necesario para actualizar otras tablas donde
      // auth.uid() = seller_id / user_id (el anon client devuelve 0 rows silenciosamente)
      const adminClient = supabaseAdmin || client
      console.log(`[musicianService] Propagando nombre "${newName}" para userId=${userId} (admin=${!!supabaseAdmin})`)

      const results = await Promise.allSettled([
        adminClient.from('comments').update({ user_name: newName }).eq('user_id', userId),
        adminClient.from('beats').update({ seller_name: newName }).eq('seller_id', userId),
        adminClient.from('lyrics').update({ seller_name: newName }).eq('seller_id', userId),
        adminClient.from('film_makers').update({ seller_name: newName }).eq('seller_id', userId),
        adminClient.from('graphic_design').update({ seller_name: newName }).eq('seller_id', userId),
      ])

      results.forEach((r, i) => {
        const table = ['comments','beats','lyrics','film_makers','graphic_design'][i]
        if (r.status === 'rejected') console.error(`[musicianService] Error actualizando ${table}:`, r.reason)
        else if (r.value?.error) console.error(`[musicianService] Supabase error en ${table}:`, r.value.error)
        else console.log(`[musicianService] ${table} actualizado correctamente`)
      })
    }

    return data
  },

  async create(userId, fields = {}) {
    // Generar slug único a partir del nombre o del userId
    const baseName = (fields.name || '').trim() || `user-${userId.slice(0, 8)}`
    const slug = baseName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + userId.slice(0, 4)

    const { data, error } = await supabase
      .from('musicians')
      .insert([{
        user_id:      userId,
        name:         baseName,
        slug,
        bio:          fields.bio          || null,
        location:     fields.location     || null,
        avatar_url:   fields.avatar_url   || null,
        cover_url:    fields.cover_url    || null,
        categories:   fields.categories   || [],
        is_published: true,
      }])
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
