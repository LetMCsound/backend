import { supabase } from '../lib/supabase.js'

/**
 * Servicio de notificaciones — tabla public.notifications
 * Esquema: id, user_id, type, title, body, conversation_id, is_read, created_at
 */
export const notificationService = {
  async getByUser(userId, limit = 30) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit, 10))
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async markAsRead(id, userId) {
    // Verificar propiedad
    const { data: notif } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .maybeSingle()
    if (!notif) throw { status: 404, message: 'Notificación no encontrada' }
    if (notif.user_id !== userId) throw { status: 403, message: 'No tienes acceso a esta notificación' }

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  },

  async create({ userId, type, title, body, conversationId = null }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        title,
        body,
        conversation_id: conversationId
      }])
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  }
}
