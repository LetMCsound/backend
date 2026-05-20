import { supabase } from '../lib/supabase.js'

export const authService = {
  async register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw { status: 401, message: error.message }
    return data
  },

  async logout(token) {
    const { error } = await supabase.auth.admin?.signOut?.(token)
    if (error) throw { status: 500, message: error.message }
    return { success: true }
  },

  async getMe(token) {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error) throw { status: 401, message: error.message }
    return user
  }
}
