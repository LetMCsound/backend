import { favoriteService } from '../services/favoriteService.js'

export const favoriteController = {
  async myFavorites(req, res, next) {
    try {
      const data = await favoriteService.getByUser(req.user.id, req.query.contentType)
      res.json(data)
    } catch (err) { next(err) }
  },

  async check(req, res, next) {
    try {
      const isFav = await favoriteService.isFavorite(req.user.id, req.params.contentId)
      res.json({ isFavorite: isFav })
    } catch (err) { next(err) }
  },

  async add(req, res, next) {
    try {
      const data = await favoriteService.add(req.user.id, req.body)
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async remove(req, res, next) {
    try {
      await favoriteService.remove(req.user.id, req.params.contentId)
      res.status(204).send()
    } catch (err) { next(err) }
  }
}
