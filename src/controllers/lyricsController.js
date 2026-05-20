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

  async create(req, res, next) {
    try {
      const data = await lyricsService.create(req.body)
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async remove(req, res, next) {
    try {
      await lyricsService.remove(req.params.id)
      res.status(204).send()
    } catch (err) { next(err) }
  }
}
