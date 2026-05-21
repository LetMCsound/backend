import { beatService } from '../services/beatService.js'
import { getDisplayName } from '../lib/displayName.js'

export const beatController = {
  async list(req, res, next) {
    try { res.json(await beatService.getAll(req.query)) }
    catch (err) { next(err) }
  },
  async detail(req, res, next) {
    try { res.json(await beatService.getById(req.params.id)) }
    catch (err) { next(err) }
  },
  async bySeller(req, res, next) {
    try { res.json(await beatService.getBySeller(req.params.sellerId)) }
    catch (err) { next(err) }
  },
  async popular(req, res, next) {
    try { res.json(await beatService.getPopular(req.query.limit)) }
    catch (err) { next(err) }
  },
  async search(req, res, next) {
    try { res.json(await beatService.search(req.query.q, req.query.limit)) }
    catch (err) { next(err) }
  },
  async create(req, res, next) {
    try {
      const data = await beatService.create(
        req.body,
        req.user.id,
        await getDisplayName(req.user),
        req.supabase
      )
      res.status(201).json(data)
    } catch (err) { next(err) }
  },
  async update(req, res, next) {
    try { res.json(await beatService.update(req.params.id, req.body, req.user.id, req.supabase)) }
    catch (err) { next(err) }
  },
  async remove(req, res, next) {
    try { await beatService.remove(req.params.id, req.user.id, req.supabase); res.status(204).send() }
    catch (err) { next(err) }
  },
  async like(req, res, next) {
    try { res.json({ likes: await beatService.incrementLikes(req.params.id) }) }
    catch (err) { next(err) }
  },
  async play(req, res, next) {
    try { res.json({ plays: await beatService.incrementPlays(req.params.id) }) }
    catch (err) { next(err) }
  }
}
