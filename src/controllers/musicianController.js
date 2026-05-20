import { musicianService } from '../services/musicianService.js'

export const musicianController = {
  async list(req, res, next) {
    try {
      const data = await musicianService.getAll(req.query)
      res.json(data)
    } catch (err) { next(err) }
  },

  async detail(req, res, next) {
    try {
      const data = await musicianService.getById(req.params.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async bySlug(req, res, next) {
    try {
      const data = await musicianService.getBySlug(req.params.slug)
      res.json(data)
    } catch (err) { next(err) }
  },

  async myProfile(req, res, next) {
    try {
      const data = await musicianService.getByUserId(req.user.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const data = await musicianService.update(req.params.id, req.body, req.user.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async search(req, res, next) {
    try {
      const data = await musicianService.search(req.query.q, req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  }
}
