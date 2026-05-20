import { beatService } from '../services/beatService.js'

export const beatController = {
  async list(req, res, next) {
    try {
      const data = await beatService.getAll(req.query)
      res.json(data)
    } catch (err) { next(err) }
  },

  async detail(req, res, next) {
    try {
      const data = await beatService.getById(req.params.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async bySeller(req, res, next) {
    try {
      const data = await beatService.getBySeller(req.params.sellerId)
      res.json(data)
    } catch (err) { next(err) }
  },

  async popular(req, res, next) {
    try {
      const data = await beatService.getPopular(req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  },

  async search(req, res, next) {
    try {
      const data = await beatService.search(req.query.q, req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const data = await beatService.create(
        req.body,
        req.user.id,
        req.user.user_metadata?.name || req.user.email?.split('@')[0]
      )
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const data = await beatService.update(req.params.id, req.body, req.user.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async remove(req, res, next) {
    try {
      await beatService.remove(req.params.id, req.user.id)
      res.status(204).send()
    } catch (err) { next(err) }
  },

  async like(req, res, next) {
    try {
      const data = await beatService.incrementLikes(req.params.id)
      res.json({ likes: data })
    } catch (err) { next(err) }
  },

  async play(req, res, next) {
    try {
      const data = await beatService.incrementPlays(req.params.id)
      res.json({ plays: data })
    } catch (err) { next(err) }
  }
}
