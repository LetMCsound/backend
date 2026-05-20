import { chatService } from '../services/chatService.js'

export const chatController = {
  async myConversations(req, res, next) {
    try {
      const data = await chatService.getConversationsByUser(req.user.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async getOrCreate(req, res, next) {
    try {
      const data = await chatService.getOrCreateConversation({
        ...req.body,
        buyerId: req.user.id,
        buyerName: req.user.user_metadata?.name || req.user.email?.split('@')[0]
      }, req.supabase)
      res.json(data)
    } catch (err) { next(err) }
  },

  async updateStatus(req, res, next) {
    try {
      const { status, finalPrice } = req.body
      const data = await chatService.updateConversationStatus(
        req.params.id, status, finalPrice ?? null, req.user.id, req.supabase
      )
      res.json(data)
    } catch (err) { next(err) }
  },

  async signContract(req, res, next) {
    try {
      const { role } = req.body
      const data = await chatService.signContract(req.params.id, role, req.user.id, req.supabase)
      res.json(data)
    } catch (err) { next(err) }
  },

  async getMessages(req, res, next) {
    try {
      const data = await chatService.getMessages(req.params.id, req.user.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async sendMessage(req, res, next) {
    try {
      const data = await chatService.sendMessage({
        conversationId: req.params.id,
        senderId: req.user.id,
        senderName: req.user.user_metadata?.name || req.user.email?.split('@')[0],
        ...req.body
      }, req.supabase)
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async respondToOffer(req, res, next) {
    try {
      const { status, conversationId, amount } = req.body
      const data = await chatService.respondToOffer(
        req.params.messageId, status, conversationId, amount, req.user.id, req.supabase
      )
      res.json(data)
    } catch (err) { next(err) }
  }
}
