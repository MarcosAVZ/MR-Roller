import { z } from 'zod'
import { idSchema } from './common.js'

export const imagenSchema = z.object({
  id: idSchema.optional(),
  nombre: z.string({ required_error: 'nombre es requerido' }).min(1),
  src: z.string().url('src debe ser una URL válida').optional().nullable()
  // Si el src lo completa el storage al subir el file, dejalo optional
})

export const validateImagen = (input) => imagenSchema.safeParse(input)
export const validatePartialImagen = (input) => imagenSchema.partial().safeParse(input)
