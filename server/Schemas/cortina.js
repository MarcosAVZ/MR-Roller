import { z } from 'zod'
import { idSchema, isoDatetimeSchema, moneySchema, positiveNumber, nonNegativeInt } from './common.js'

// const tipoSchema = z.enum(['roller', 'romana', 'vertical', 'sunscreen', 'blackout'])
const tipoSchema = z.string().min(1, 'tipo es requerido')

export const cortinaCreateSchema = z.object({
  id: idSchema.optional(),
  nombre: z.string({ required_error: 'nombre es requerido' }).min(1),
  tipo: tipoSchema,
  precio: moneySchema,
  descripcion: z.string().max(1000).optional().nullable(),
  altura: positiveNumber, // en cm u otra unidad que uses
  ancho: positiveNumber,
  stock: nonNegativeInt.default(0),
  create_at: isoDatetimeSchema,
  update_at: isoDatetimeSchema
})

export const cortinaUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  tipo: z.string().min(1).optional(),
  precio: moneySchema.optional(),
  descripcion: z.string().max(1000).optional().nullable(),
  altura: positiveNumber.optional(),
  ancho: positiveNumber.optional(),
  stock: nonNegativeInt.optional()
})

export const validateCortina = (input) => cortinaCreateSchema.safeParse(input)
export const validatePartialCortina = (input) => cortinaUpdateSchema.partial().safeParse(input)
