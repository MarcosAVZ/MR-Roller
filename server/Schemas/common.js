import { z } from 'zod'

// Acepta IDs numéricos o string (UUID/DB id). Ajustá si tu DB es estricta.
export const idSchema = z.union([
  z.string().min(1, 'id vacío no permitido'),
  z.number().int().positive()
])

export const isoDatetimeSchema = z.string().datetime().or(z.date()).optional()

// Números útiles
export const moneySchema = z.number({
  required_error: 'precio es requerido'
}).nonnegative('precio no puede ser negativo')

export const positiveNumber = z.number().positive()
export const nonNegativeInt = z.number().int().nonnegative()
