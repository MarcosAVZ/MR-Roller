import { z } from 'zod'
import { idSchema } from './common.js'

export const categoriaSchema = z.object({
  id: idSchema.optional(),
  nombre: z.string({ required_error: 'nombre es requerido' }).min(1),
  descripcion: z.string().max(500).optional().nullable()
})

export const validateCategoria = (input) => categoriaSchema.safeParse(input)
export const validatePartialCategoria = (input) => categoriaSchema.partial().safeParse(input)
