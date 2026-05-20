import { ventaService } from '../services/ventaService.js'

export const ventaController = {
  async create(req, res, next) {
    try {
      const venta = { ...req.body, comprador: req.user.email }
      const data = await ventaService.create(venta, req.supabase)
      res.status(201).json(data)
    } catch (err) { next(err) }
  },

  async myVentas(req, res, next) {
    try {
      const data = await ventaService.getByUser(req.user.email)
      res.json(data)
    } catch (err) { next(err) }
  }
}
