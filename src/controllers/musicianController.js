import { musicianService } from '../services/musicianService.js'

export const musicianController = {
  async list(req, res, next) {
    try { res.json(await musicianService.getAll(req.query)) }
    catch (err) { next(err) }
  },

  async detail(req, res, next) {
    try { res.json(await musicianService.getById(req.params.id)) }
    catch (err) { next(err) }
  },

  async bySlug(req, res, next) {
    try { res.json(await musicianService.getBySlug(req.params.slug)) }
    catch (err) { next(err) }
  },

  async myProfile(req, res, next) {
    try { res.json(await musicianService.getByUserId(req.user.id)) }
    catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const data = await musicianService.update(req.params.id, req.body, req.user.id, req.supabase)
      res.json(data)
    } catch (err) { next(err) }
  },

  async search(req, res, next) {
    try { res.json(await musicianService.search(req.query.q, req.query.limit)) }
    catch (err) { next(err) }
  }
}
