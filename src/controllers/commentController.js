import { commentService } from '../services/commentService.js'
import { getDisplayName } from '../lib/displayName.js'

export const commentController = {
  async list(req, res, next) {
    try {
      const { contentId, contentType } = req.query
      if (!contentId || !contentType) {
        throw { status: 400, message: 'contentId y contentType son obligatorios' }
      }
      const data = await commentService.getByContent(contentId, contentType)
      res.json(data)
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const userName = await getDisplayName(req.user)
      const data = await commentService.create({
        userId: req.user.id,
        userName,
        ...req.body
      }, req.supabase)
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async remove(req, res, next) {
    try {
      await commentService.remove(req.params.id, req.user.id)
      res.status(204).send()
    } catch (err) { next(err) }
  }
}
