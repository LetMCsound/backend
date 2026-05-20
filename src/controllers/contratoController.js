import { contratoService } from '../services/contratoService.js'

export const contratoController = {
  async generar(req, res, next) {
    try {
      const { titulo, precio, licencia } = req.body
      const comprador = req.user.email
      const { bytes, idTransaccion } = await contratoService.generarPDF({ titulo, precio, licencia, comprador })

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Contrato_${licencia}_${idTransaccion}.pdf"`
      })
      res.send(Buffer.from(bytes))
    } catch (err) { next(err) }
  }
}
