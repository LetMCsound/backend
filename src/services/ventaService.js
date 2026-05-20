import { supabase } from '../lib/supabase.js'

export const ventaService = {
  async create(venta) {
    const { data, error } = await supabase.from('ventas').insert([venta]).select().single()
    if (error) throw { status: 400, message: error.message }
    return data
  },

  async getByUser(userEmail) {
    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .eq('comprador', userEmail)
      .order('created_at', { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return data
  }
}
