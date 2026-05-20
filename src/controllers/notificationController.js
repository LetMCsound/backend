import { notificationService } from '../services/notificationService.js'

export const notificationController = {
  async myNotifications(req, res, next) {
    try {
      const data = await notificationService.getByUser(req.user.id, req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  },

  async markAsRead(req, res, next) {
    try {
      const data = await notificationService.markAsRead(req.params.id, req.user.id, req.supabase)
      res.json(data)
    } catch (err) { next(err) }
  },

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user.id, req.supabase)
      res.status(204).send()
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const data = await notificationService.create(req.body, req.supabase)
      res.status(201).json(data)
    } catch (err) { next(err) }
  }
}
