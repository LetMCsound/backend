import { lyricsService } from '../services/lyricsService.js'
import { getDisplayName } from '../lib/displayName.js'

export const lyricsController = {
  async list(req, res, next) {
    try { res.json(await lyricsService.getAll(req.query)) }
    catch (err) { next(err) }
  },
  async detail(req, res, next) {
    try { res.json(await lyricsService.getById(req.params.id)) }
    catch (err) { next(err) }
  },
  async bySeller(req, res, next) {
    try { res.json(await lyricsService.getBySeller(req.params.sellerId)) }
    catch (err) { next(err) }
  },
  async search(req, res, next) {
    try { res.json(await lyricsService.search(req.query.q, req.query.limit)) }
    catch (err) { next(err) }
  },
  async create(req, res, next) {
    try {
      const data = await lyricsService.create(
        req.body,
        req.user.id,
        await getDisplayName(req.user),
        req.supabase
      )
      res.status(201).json(data)
    } catch (err) { next(err) }
  },
  async update(req, res, next) {
    try { res.json(await lyricsService.update(req.params.id, req.body, req.user.id, req.supabase)) }
    catch (err) { next(err) }
  },
  async remove(req, res, next) {
    try { await lyricsService.remove(req.params.id, req.user.id, req.supabase); res.status(204).send() }
    catch (err) { next(err) }
  }
}
