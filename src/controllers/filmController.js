import { filmService } from '../services/filmService.js'

export const filmController = {
  async list(req, res, next) {
    try { res.json(await filmService.getAll(req.query)) }
    catch (err) { next(err) }
  },
  async detail(req, res, next) {
    try { res.json(await filmService.getById(req.params.id)) }
    catch (err) { next(err) }
  },
  async bySeller(req, res, next) {
    try { res.json(await filmService.getBySeller(req.params.sellerId)) }
    catch (err) { next(err) }
  },
  async search(req, res, next) {
    try { res.json(await filmService.search(req.query.q, req.query.limit)) }
    catch (err) { next(err) }
  },
  async create(req, res, next) {
    try {
      const data = await filmService.create(
        req.body,
        req.user.id,
        req.user.user_metadata?.name || req.user.email?.split('@')[0]
      )
      res.status(201).json(data)
    } catch (err) { next(err) }
  },
  async update(req, res, next) {
    try { res.json(await filmService.update(req.params.id, req.body, req.user.id)) }
    catch (err) { next(err) }
  },
  async remove(req, res, next) {
    try { await filmService.remove(req.params.id, req.user.id); res.status(204).send() }
    catch (err) { next(err) }
  },
  async view(req, res, next) {
    try { res.json({ views: await filmService.incrementViews(req.params.id) }) }
    catch (err) { next(err) }
  }
}
