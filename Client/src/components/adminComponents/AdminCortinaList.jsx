import './AdminCortinaList.css'

function AdminCortinaList ({ cortinas, onEdit, onDelete, onLinkImages }) {
  const cortinasArray = Array.isArray(cortinas) ? cortinas : []

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '€0.00'
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)
  }

  const formatDimensions = (altura, ancho) => {
    const h = altura || 0
    const w = ancho || 0
    return `${h}cm x ${w}cm`
  }

  if (cortinasArray.length === 0) {
    return (
      <div className="admin-cortina-list">
        <div className="empty-state">
          <h3>📭 No hay cortinas</h3>
          <p>Crea tu primera cortina para comenzar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-cortina-list">
      <div className="list-header">
        <h3>📋 Lista de Cortinas</h3>
        <span className="total-count">{cortinasArray.length} cortinas</span>
      </div>

      <div className="cortinas-table">
        <div className="table-header">
          <div className="col-image">Imagen</div>
          <div className="col-nombre">Nombre</div>
          <div className="col-tipo">Tipo</div>
          <div className="col-precio">Precio</div>
          <div className="col-dimensions">Dimensiones</div>
          <div className="col-stock">Stock</div>
          <div className="col-actions">Acciones</div>
        </div>

        <div className="table-body">
          {cortinasArray.map(cortina => (
            <div key={cortina.id} className="table-row">
              <div className="col-image">
                {cortina.imagen
                  ? <img src={cortina.imagen} alt={cortina.nombre} className="cortina-thumb" />
                  : <div className="no-thumb">🪟</div>}
              </div>

              <div className="col-nombre">
                <div className="cortina-name">{cortina.nombre || 'Sin nombre'}</div>
                {cortina.descripcion && (
                  <div className="cortina-desc">{cortina.descripcion}</div>
                )}
              </div>

              <div className="col-tipo">
                <span className={`tipo-badge tipo-${cortina.tipo?.toLowerCase() || 'default'}`}>
                  {cortina.tipo || 'Sin tipo'}
                </span>
              </div>

              <div className="col-precio">
                <span className="price">{formatPrice(cortina.precio)}</span>
              </div>

              <div className="col-dimensions">
                <span className="dimensions">{formatDimensions(cortina.altura, cortina.ancho)}</span>
              </div>

              <div className="col-stock">
                <span className={`stock-badge ${(cortina.stock || 0) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {(cortina.stock || 0) > 0 ? `${cortina.stock}` : 'Agotado'}
                </span>
              </div>

              <div className="col-actions">
                <button
                  onClick={() => onEdit(cortina)}
                  className="action-button edit-button"
                  title="Editar cortina"
                >
                  ✏️
                </button>

                <button
                  onClick={() => onDelete(cortina.id)}
                  className="action-button delete-button"
                  title="Eliminar cortina"
                >
                  🗑️
                </button>

                <button
                  onClick={() => onLinkImages(cortina.id)}
                  className="action-button link-button"
                  title="Vincular imágenes"
                >
                  🖼️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminCortinaList
