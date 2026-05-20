import { supabase } from '../lib/supabase.js'

/**
 * Servicio de comentarios — tabla public.comments
 * Esquema: id, user_id, user_name, content_id, content_type, text, created_at
 */
export const commentService = {
  async getByContent(contentId, contentType) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: true })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async create({ userId, userName, contentId, contentType, text }) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        user_id: userId,
        user_name: userName,
        content_id: contentId,
        content_type: contentType,
        text
      }])
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async remove(id, userId) {
    // Verificar propiedad
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .maybeSingle()
    if (!comment) throw { status: 404, message: 'Comentario no encontrado' }
    if (comment.user_id !== userId) throw { status: 403, message: 'No puedes borrar este comentario' }

    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  }
}
