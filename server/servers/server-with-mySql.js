import { CreateApp } from '../app.js'
import { TelaModel } from '../models/Sql/model-tela.js'
import { CortinaModel } from '../models/Sql/model-cortina.js'
import { ImagenModel } from '../models/Sql/model-imagen.js'
import { CategoriaModel } from '../models/Sql/model-categoria.js'

CreateApp({
  cortinaModel: CortinaModel,
  imagenModel: ImagenModel,
  categoriaModel: CategoriaModel,
  telaModel: TelaModel
})
