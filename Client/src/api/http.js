// Cliente HTTP para conectar con la API del servidor
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' // En desarrollo, usar proxy de Vite con prefijo /api
  : 'http://localhost:1234' // En producción, URL completa del servidor

/**
 * Función base para realizar peticiones HTTP
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch
 * @returns {Promise} Respuesta de la API
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Intentar parsear como JSON, si falla devolver texto
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return await response.text()
  } catch (error) {
    console.error('Error en petición API:', error)
    throw error
  }
}

/**
 * Realizar petición GET
 * @param {string} endpoint - Endpoint de la API
 * @returns {Promise} Respuesta de la API
 */
export async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' })
}

/**
 * Realizar petición POST
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @returns {Promise} Respuesta de la API
 */
export async function post(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Realizar petición PUT
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @returns {Promise} Respuesta de la API
 */
export async function put(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Realizar petición DELETE
 * @param {string} endpoint - Endpoint de la API
 * @returns {Promise} Respuesta de la API
 */
export async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' })
}

/**
 * Subir archivo usando FormData
 * @param {string} endpoint - Endpoint de la API
 * @param {FormData} formData - Datos del formulario con archivo
 * @returns {Promise} Respuesta de la API
 */
export async function uploadFile(endpoint, formData) {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData, // No establecer Content-Type, el navegador lo hará automáticamente
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return await response.text()
  } catch (error) {
    console.error('Error subiendo archivo:', error)
    throw error
  }
}

// Exportar también como default para facilitar el uso
export default {
  get,
  post,
  put,
  delete: del,
  uploadFile,
}
