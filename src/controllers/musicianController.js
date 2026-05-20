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
  }
}
