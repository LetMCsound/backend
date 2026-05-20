import { supabase } from '../lib/supabase.js'

/**
 * Servicio de chat — tablas public.conversations y public.messages
 *
 * Tabla conversations:
 *   id, buyer_id, seller_id, buyer_name, seller_name,
 *   product_id, product_type, product_title,
 *   status ('open' | 'accepted' | 'completed' | 'cancelled'),
 *   final_price, buyer_signed, seller_signed,
 *   contract_signed_at, created_at
 *
 * Tabla messages:
 *   id, conversation_id, sender_id, sender_name, content,
 *   type ('text' | 'offer'), offer_amount,
 *   offer_status ('pending' | 'accepted' | 'rejected'),
 *   created_at
 */
export const chatService = {
  // ─── Conversations ───
  async getConversationsByUser(userId) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async getOrCreateConversation({
    buyerId, sellerId, buyerName, sellerName,
    productId = null, productType = null, productTitle = null
  }, client = supabase) {
    let q = client
      .from('conversations')
      .select('*')
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId)
      .eq('status', 'open')
    if (productId) q = q.eq('product_id', productId)

    const { data: existing } = await q.limit(1).maybeSingle()
    if (existing) return existing

    const { data, error } = await client
      .from('conversations')
      .insert([{
        buyer_id: buyerId,
        seller_id: sellerId,
        buyer_name: buyerName,
        seller_name: sellerName,
        product_id: productId,
        product_type: productType,
        product_title: productTitle,
        status: 'open'
      }])
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async updateConversationStatus(conversationId, status, finalPrice = null, userId, client = supabase) {
    const conv = await this._getConversation(conversationId)
    if (conv.buyer_id !== userId && conv.seller_id !== userId) {
      throw { status: 403, message: 'No tienes acceso a esta conversación' }
    }

    const updates = { status }
    if (finalPrice !== null) updates.final_price = finalPrice

    const { data, error } = await client
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async signContract(conversationId, role, userId, client = supabase) {
    const conv = await this._getConversation(conversationId)

    if (role === 'buyer' && conv.buyer_id !== userId) {
      throw { status: 403, message: 'No eres el comprador' }
    }
    if (role === 'seller' && conv.seller_id !== userId) {
      throw { status: 403, message: 'No eres el vendedor' }
    }

    const field = role === 'buyer' ? 'buyer_signed' : 'seller_signed'
    const updates = { [field]: true }
    const otherSigned = role === 'buyer' ? conv.seller_signed : conv.buyer_signed
    if (otherSigned) {
      updates.status = 'completed'
      updates.contract_signed_at = new Date().toISOString()
    }

    const { data, error } = await client
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  // ─── Messages ───
  async getMessages(conversationId, userId) {
    const conv = await this._getConversation(conversationId)
    if (conv.buyer_id !== userId && conv.seller_id !== userId) {
      throw { status: 403, message: 'No tienes acceso a esta conversación' }
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw { status: 500, message: error.message }
    return data
  },

  async sendMessage({ conversationId, senderId, senderName, content, type = 'text', offerAmount = null }, client = supabase) {
    const conv = await this._getConversation(conversationId)
    if (conv.buyer_id !== senderId && conv.seller_id !== senderId) {
      throw { status: 403, message: 'No tienes acceso a esta conversación' }
    }

    const { data, error } = await client
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: senderId,
        sender_name: senderName,
        content,
        type,
        offer_amount: offerAmount,
        offer_status: type === 'offer' ? 'pending' : null
      }])
      .select()
      .single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async respondToOffer(messageId, status, conversationId, amount, userId, client = supabase) {
    const conv = await this._getConversation(conversationId)
    if (conv.buyer_id !== userId && conv.seller_id !== userId) {
      throw { status: 403, message: 'No tienes acceso a esta conversación' }
    }

    await client
      .from('messages')
      .update({ offer_status: status })
      .eq('id', messageId)

    if (status === 'accepted') {
      await client
        .from('conversations')
        .update({ status: 'accepted', final_price: amount })
        .eq('id', conversationId)
    }
    return { success: true }
  },

  // ─── Internal ───
  async _getConversation(id) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw { status: 500, message: error.message }
    if (!data) throw { status: 404, message: 'Conversación no encontrada' }
    return data
  }
}
