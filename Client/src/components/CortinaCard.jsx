import './CortinaCard.css'
import { useFirstCortinaImage } from '../hooks/useFirstCortinaImage'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

function CortinaCard({ cortina }) {
  const navigate = useNavigate()
  const cortinaId = useMemo(() => cortina?.id ?? cortina?.ID ?? null, [cortina])
  const { imagen, loading: imgLoading } = useFirstCortinaImage(cortinaId)

  if (!cortina) {
    return (
      <div className="cortina-card">
        <div className="cortina-info"><h3>Error: Cortina no encontrada</h3></div>
      </div>
    )
  }

  const goDetail = () => {
    if (cortinaId) navigate(`/cortinas/${encodeURIComponent(cortinaId)}`)
  }

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '$0,00'
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)
  }
  const formatDimensions = (altura, ancho) => `${altura || 0}cm x ${ancho || 0}cm`

  return (
    <div
      className="cortina-card cortina-card-clickable"
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goDetail()}
    >
      <div className="cortina-image">
        {imgLoading ? (
          <div className="no-image"><span>⏳</span><p>Cargando…</p></div>
        ) : imagen ? (
          <img
            src={imagen.SRC ?? imagen.src}
            alt={(imagen.Nombre ?? imagen.nombre) || cortina.nombre || 'Imagen de cortina'}
            loading="lazy" decoding="async" draggable={false}
          />
        ) : (
          <div className="no-image"><span>🪟</span><p>Sin imagen</p></div>
        )}
        <div className="cortina-badge">
          <span className={`tipo-badge tipo-${cortina.tipo?.toLowerCase() || 'default'}`}>
            {cortina.tipo || 'Sin tipo'}
          </span>
        </div>
      </div>

      <div className="cortina-info">
        <h3 className="cortina-nombre">{cortina.nombre || 'Sin nombre'}</h3>

        {cortina.descripcion && <p className="cortina-descripcion">{cortina.descripcion}</p>}

        <div className="cortina-details">
          <div className="detail-item">
            <span className="detail-label">📏 Dimensiones:</span>
            <span className="detail-value">{formatDimensions(cortina.altura, cortina.ancho)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📦 Stock:</span>
            <span className={`detail-value stock-${(cortina.stock || 0) > 0 ? 'available' : 'unavailable'}`}>
              {(cortina.stock || 0) > 0 ? `${cortina.stock} disponibles` : 'Agotado'}
            </span>
          </div>
        </div>

        <div className="cortina-footer">
          <div className="cortina-precio">{formatPrice(cortina.precio)}</div>

          <button
            className={`add-to-cart-btn ${(cortina.stock || 0) > 0 ? 'available' : 'unavailable'}`}
            disabled={(cortina.stock || 0) === 0}
            onClick={(e) => {
              e.stopPropagation() // <- evita navegar al detalle
              // addToCart(cortinaId) ...
            }}
          >
            {(cortina.stock || 0) > 0 ? '🛒 Agregar al carrito' : '❌ Agotado'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CortinaCard
