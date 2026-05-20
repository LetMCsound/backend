import { soundService } from '../services/soundService.js'

export const soundController = {
  async list(req, res, next) {
    try {
      const data = await soundService.getAll(req.query)
      res.json(data)
    } catch (err) { next(err) }
  },

  async detail(req, res, next) {
    try {
      const data = await soundService.getById(req.params.id)
      res.json(data)
    } catch (err) { next(err) }
  },

  async trending(req, res, next) {
    try {
      const data = await soundService.getTrending(req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  },

  async recent(req, res, next) {
    try {
      const data = await soundService.getRecent(req.query.limit)
      res.json(data)
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const data = await soundService.create(req.body)
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const data = await soundService.update(req.params.id, req.body)
      res.json(data)
    } catch (err) { next(err) }
  },

  async remove(req, res, next) {
    try {
      await soundService.remove(req.params.id)
      res.status(204).send()
    } catch (err) { next(err) }
  }
}
