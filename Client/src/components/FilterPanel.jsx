import './FilterPanel.css'

function FilterPanel({ filters, onFilterChange, onClearFilters, totalCortinas, filteredCount }) {
  const tiposCortina = [
    'roller',
    'romana', 
    'vertical',
    'sunscreen',
    'blackout'
  ]

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🔍 Filtros</h3>
        <div className="filter-stats">
          <span>{filteredCount} de {totalCortinas}</span>
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="busqueda">🔎 Buscar</label>
        <input
          id="busqueda"
          type="text"
          placeholder="Nombre o descripción..."
          value={filters.busqueda}
          onChange={(e) => handleInputChange('busqueda', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-section">
        <label htmlFor="tipo">🪟 Tipo de Cortina</label>
        <select
          id="tipo"
          value={filters.tipo}
          onChange={(e) => handleInputChange('tipo', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los tipos</option>
          {tiposCortina.map(tipo => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button 
            onClick={onClearFilters}
            className="clear-filters-button"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
      )}

      <div className="filter-info">
        <p>💡 Tip: Usa los filtros para encontrar exactamente lo que buscas</p>
      </div>
    </div>
  )
}

export default FilterPanel
