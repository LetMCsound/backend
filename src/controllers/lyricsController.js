import { lyricsService } from '../services/lyricsService.js'

export const lyricsController = {
  async list(req, res, next) {
    try {
      const data = await lyricsService.getAll(req.query)
      res.json(data)
    } catch (err) { next(err) }
  },

  async detail(req, res, next) {
    try {
      const data = await lyricsService.getById(req.params.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async bySeller(req, res, next) {
    try {
      const data = await lyricsService.getBySeller(req.params.sellerId)
      res.json(data)
    } catch (err) { next(err) }
  },

  async search(req, res, next) {
    try {
      const data = await lyricsService.search(req.query.q, req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const data = await lyricsService.create(
        req.body,
        req.user.id,
        req.user.user_metadata?.name || req.user.email?.split('@')[0]
      )
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const data = await lyricsService.update(req.params.id, req.body, req.user.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async remove(req, res, next) {
    try {
      await lyricsService.remove(req.params.id, req.user.id)
      res.status(204).send()
    } catch (err) { next(err) }
  }
}
