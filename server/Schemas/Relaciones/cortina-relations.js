import { z } from 'zod'
import { idSchema } from './common.js'

// Tabla: Cortina_Tela  (Pk/Fk: id_tela + id_cortina)
export const cortinaTelaSchema = z.object({
  id_tela: idSchema,
  id_cortina: idSchema
})
export const validateCortinaTela = (input) => cortinaTelaSchema.safeParse(input)
export const validatePartialCortinaTela = (input) => cortinaTelaSchema.partial().safeParse(input)

// Tabla: Cortina_Imagen  (Pk/Fk: id_imagen + id_cortina)
export const cortinaImagenSchema = z.object({
  id_imagen: idSchema,
  id_cortina: idSchema
})
export const validateCortinaImagen = (input) => cortinaImagenSchema.safeParse(input)
export const validatePartialCortinaImagen = (input) => cortinaImagenSchema.partial().safeParse(input)

// Tabla: Cortina_Categoria (Pk/Fk: id_categoria + id_cortina)
export const cortinaCategoriaSchema = z.object({
  id_categoria: idSchema,
  id_cortina: idSchema
})
export const validateCortinaCategoria = (input) => cortinaCategoriaSchema.safeParse(input)
export const validatePartialCortinaCategoria = (input) => cortinaCategoriaSchema.partial().safeParse(input)
