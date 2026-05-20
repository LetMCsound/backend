import { supabase } from '../lib/supabase.js'

/**
 * Servicio de diseño gráfico — tabla public.graphic_design
 * Esquema: seller_id, seller_name, title, description, style, cover_url,
 * tags, prices, is_published.
 */
export const graphicService = {
  async getAll({ style, limit = 50 } = {}) {
    let q = supabase
      .from('graphic_design')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit, 10))
    if (style) q = q.eq('style', style)
    const { data, error } = await q
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('graphic_design')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Diseño no encontrado' }
    return data
  },

  async getBySeller(sellerId) {
    const { data, error } = await supabase
      .from('graphic_design')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async search(query, limit = 20) {
    if (!query) return []
    const { data, error } = await supabase
      .from('graphic_design')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,style.ilike.%${query}%`)
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async create(design, sellerId, sellerName, client = supabase) {
    const payload = { ...design, seller_id: sellerId, seller_name: sellerName || 'Unknown' }
    const { data, error } = await client.from('graphic_design').insert([payload]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async update(id, updates, userId, client = supabase) {
    const design = await this.getById(id)
    if (design.seller_id !== userId) throw { status: 403, message: 'No puedes editar este diseño' }
    const { data, error } = await client
      .from('graphic_design')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id, userId, client = supabase) {
    const design = await this.getById(id)
    if (design.seller_id !== userId) throw { status: 403, message: 'No puedes eliminar este diseño' }
    const { error } = await client.from('graphic_design').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  }
}
