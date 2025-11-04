import { CortinaModel } from './models/Sql/model-cortina.js'
import { CategoriaModel } from './models/Sql/model-categoria.js'

// Datos de prueba para categorías
const categoriasPrueba = [
  {
    nombre: 'Cortinas Roller',
    descripcion: 'Cortinas enrollables modernas y elegantes'
  },
  {
    nombre: 'Cortinas Romanas',
    descripcion: 'Cortinas con pliegues horizontales clásicas'
  },
  {
    nombre: 'Cortinas Verticales',
    descripcion: 'Cortinas de tiras verticales para grandes ventanas'
  }
]

// Datos de prueba para cortinas
const cortinasPrueba = [
  {
    nombre: 'Cortina Roller Moderna',
    tipo: 'roller',
    precio: 89.99,
    descripcion: 'Cortina enrollable en color blanco, perfecta para cualquier habitación',
    altura: 200,
    ancho: 120,
    stock: 15,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  },
  {
    nombre: 'Cortina Romana Elegante',
    tipo: 'romana',
    precio: 125.50,
    descripcion: 'Cortina romana en tela de lino, ideal para salones',
    altura: 180,
    ancho: 150,
    stock: 8,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  },
  {
    nombre: 'Cortina Vertical Profesional',
    tipo: 'vertical',
    precio: 199.99,
    descripcion: 'Cortina vertical para oficinas y espacios amplios',
    altura: 250,
    ancho: 200,
    stock: 5,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  },
  {
    nombre: 'Cortina Sunscreen',
    tipo: 'sunscreen',
    precio: 75.00,
    descripcion: 'Cortina que filtra la luz solar manteniendo la privacidad',
    altura: 160,
    ancho: 100,
    stock: 12,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  },
  {
    nombre: 'Cortina Blackout Premium',
    tipo: 'blackout',
    precio: 149.99,
    descripcion: 'Cortina que bloquea completamente la luz, perfecta para dormitorios',
    altura: 220,
    ancho: 140,
    stock: 10,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  },
  {
    nombre: 'Cortina Roller Económica',
    tipo: 'roller',
    precio: 45.99,
    descripcion: 'Cortina enrollable básica, excelente relación calidad-precio',
    altura: 180,
    ancho: 90,
    stock: 20,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando inserción de datos de prueba...')

    // Insertar categorías
    console.log('📂 Insertando categorías...')
    for (const categoria of categoriasPrueba) {
      await CategoriaModel.create(categoria)
      console.log(`✅ Categoría creada: ${categoria.nombre}`)
    }

    // Insertar cortinas
    console.log('🪟 Insertando cortinas...')
    for (const cortina of cortinasPrueba) {
      await CortinaModel.create(cortina)
      console.log(`✅ Cortina creada: ${cortina.nombre}`)
    }

    console.log('🎉 ¡Datos de prueba insertados correctamente!')
    console.log(`📊 Resumen:`)
    console.log(`   - ${categoriasPrueba.length} categorías`)
    console.log(`   - ${cortinasPrueba.length} cortinas`)
    
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error)
  }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
}

export { seedDatabase }
