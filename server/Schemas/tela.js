import { z } from 'zod'
import { idSchema } from './common.js'

export const telaSchema = z.object({
  id: idSchema.optional(),
  nombre: z.string({ required_error: 'nombre es requerido' }).min(1),
  imagen: z.string().url('imagen debe ser una URL válida').optional().nullable()
})

export const validateTela = (input) => telaSchema.safeParse(input)
export const validatePartialTela = (input) => telaSchema.partial().safeParse(input)
