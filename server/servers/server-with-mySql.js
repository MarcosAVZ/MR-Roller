import { CreateApp } from '../app.js'
import { TelaModel } from '../models/Sql/model-tela.js'
import { CortinaModel } from '../models/Sql/model-cortina.js'
import { ImagenModel } from '../models/Sql/model-imagen.js'
import { CortinaImagenModel } from '../models/Sql/model-cortina-imagen.js'

CreateApp({
  cortinaModel: CortinaModel,
  imagenModel: ImagenModel,
  telaModel: TelaModel,
  cortinaImagenModel: CortinaImagenModel
})
