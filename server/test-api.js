// Script simple para probar la API
import { get } from './api/http.js'

async function testAPI() {
  try {
    console.log('🧪 Probando conexión con la API...')
    
    // Probar endpoint de cortinas
    const cortinas = await get('/cortinas')
    console.log('✅ Cortinas obtenidas:', cortinas.length)
    console.log('📋 Datos:', cortinas)
    
    // Probar endpoint de categorías
    const categorias = await get('/categorias')
    console.log('✅ Categorías obtenidas:', categorias.length)
    console.log('📋 Datos:', categorias)
    
  } catch (error) {
    console.error('❌ Error al probar la API:', error.message)
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en el puerto 1234')
  }
}

testAPI()
