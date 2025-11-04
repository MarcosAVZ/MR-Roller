import { useState, useEffect } from 'react'
import { get } from '../api/http.js'
import CortinaCard from '../components/CortinaCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import './CortinasPage.css'

function CortinasPage() {
  const [cortinas, setCortinas] = useState([])
  const [filteredCortinas, setFilteredCortinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    tipo: '',
    busqueda: ''
  })

  useEffect(() => {
    loadCortinas()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [cortinas, filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadCortinas = async () => {  
  try {
    setLoading(true)

    // 1) Traer todas las cortinas
    const data = await get('/cortinas')
    const cortinasArray = Array.isArray(data) ? data : []

    // 2) Para cada cortina, pedir sus imágenes en paralelo
    const results = await Promise.allSettled(
      cortinasArray.map(async (c) => {
        const id = c.id ?? c.ID
        if (!id) return { id: undefined, src: null, imgs: [] }

        const imgs = await get(`/cortinas/${encodeURIComponent(id)}/imagenes`)
        const arr = Array.isArray(imgs) ? imgs : []
        // toma la primera como principal
        const src = arr[0]?.SRC ?? arr[0]?.src ?? null
        return { id, src, imgs: arr }
      })
    )

    // 3) Armar un map por id para fácil acceso
    const byId = new Map()
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value?.id) {
        byId.set(r.value.id, { src: r.value.src, imgs: r.value.imgs })
      }
    }

    // 4) Fusionar: si la cortina ya tiene imagen/SRC, se respeta; si no, usamos la primera
    const merged = cortinasArray.map(c => {
      const id = c.id ?? c.ID
      const info = byId.get(id) || {}
      const imagenPrincipal = c.imagen ?? c.SRC ?? info.src ?? null
      return {
        ...c,
        imagen: imagenPrincipal,     // ← listo para que CortinaCard lo use directo
        _imagenes: info.imgs || []   // opcional: conservar todas por si querés un carrusel
      }
    })

    setCortinas(merged)
  } catch (error) {
    console.error('Error al cargar cortinas:', error)
    setError('Error al cargar las cortinas: ' + error.message)
    setCortinas([])
  } finally {
    setLoading(false)
  }
}


  const applyFilters = () => {
    let filtered = [...cortinas]

    // Filtro por tipo
    if (filters.tipo) {
      filtered = filtered.filter(cortina => 
        cortina.tipo && cortina.tipo.toLowerCase().includes(filters.tipo.toLowerCase())
      )
    }


    // Filtro por búsqueda (nombre o descripción)
    if (filters.busqueda) {
      const searchTerm = filters.busqueda.toLowerCase()
      filtered = filtered.filter(cortina => 
        (cortina.nombre && cortina.nombre.toLowerCase().includes(searchTerm)) ||
        (cortina.descripcion && cortina.descripcion.toLowerCase().includes(searchTerm))
      )
    }

    setFilteredCortinas(filtered)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      tipo: '',
      busqueda: ''
    })
  }

  if (loading) {
    return (
      <div className="cortinas-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando cortinas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="cortinas-page">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={loadCortinas} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cortinas-page">
      <div className="page-header">
        <h1>🪟 Nuestras Cortinas</h1>
        <p>Encuentra la cortina perfecta para tu hogar</p>
      </div>

      <div className="page-content">
        <aside className="filters-sidebar">
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalCortinas={cortinas.length}
            filteredCount={filteredCortinas.length}
          />
        </aside>

        <main className="cortinas-grid">
          {filteredCortinas.length === 0 ? (
            <div className="no-results">
              {cortinas.length === 0 ? (
                <>
                  <h3>📭 No hay cortinas disponibles</h3>
                  <p>El catálogo está vacío. Contacta al administrador para agregar productos.</p>
                  <button onClick={loadCortinas} className="clear-filters-btn">
                    🔄 Recargar
                  </button>
                </>
              ) : (
                <>
                  <h3>🔍 No se encontraron cortinas</h3>
                  <p>Intenta ajustar los filtros de búsqueda</p>
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Limpiar filtros
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>Mostrando {filteredCortinas.length} de {cortinas.length} cortinas</p>
              </div>
              <div className="cortinas-container">
                {filteredCortinas.map(cortina => (
                  <CortinaCard key={cortina.id ?? cortina.ID} cortina={cortina} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default CortinasPage
