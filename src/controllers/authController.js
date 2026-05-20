import { authService } from '../services/authService.js'

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.body
      const data = await authService.register(email, password)
      res.status(201).json({ message: 'Registro exitoso. Verifica tu correo.', user: data.user })
    } catch (err) { next(err) }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const data = await authService.login(email, password)
      res.json({ session: data.session, user: data.user })
    } catch (err) { next(err) }
  },

  async me(req, res, next) {
    try {
      res.json({ user: req.user })
    } catch (err) { next(err) }
  }
}
