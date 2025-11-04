import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get } from '../api/http' // si no tenés get, usa fetch nativo
import './CortinaDetailPage.css'

export default function CortinaDetailPage() {
  const { id } = useParams()
  const [cortina, setCortina] = useState(null)
  const [imagenes, setImagenes] = useState([]) // [{ID, SRC, Nombre}]
  const [activeIdx, setActiveIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        // Ajustá las URLs a tu API real
        const data = await get(`/cortinas/${encodeURIComponent(id)}`)
        const imgs = await get(`/cortinas/${encodeURIComponent(id)}/imagenes`) // devuelve array
        if (!mounted) return
        setCortina(data)
        setImagenes(Array.isArray(imgs) ? imgs : (imgs?.items ?? []))
      } catch (e) {
        setError('No se pudo cargar la cortina', e.message)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  const priceFmt = useMemo(() => {
    const v = Number(cortina?.precio ?? 0)
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(v)
  }, [cortina])

  if (loading) return <div className="cdp-container"><div className="cdp-skel" /></div>
  if (error) return <div className="cdp-container"><p>{error}</p></div>
  if (!cortina) return null

  const mainImg = imagenes[activeIdx]?.SRC ?? imagenes[activeIdx]?.src

  const stock = Number(cortina.stock ?? 0)
  const disabledAdd = stock <= 0

  const onAddToCart = () => {
    // acá integrás con tu carrito
    // addToCart({ id: cortina.id || cortina.ID, qty })
    alert(`Agregado: ${qty} unidad(es)`)
  }

  return (
    <div className="cdp-container">
      {/* Columna izquierda: galería */}
      <aside className="cdp-gallery">
        <div className="cdp-thumbs">
          {imagenes.map((img, i) => (
            <button
              key={img.ID || i}
              className={`cdp-thumb ${i === activeIdx ? 'is-active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={img.SRC ?? img.src} alt={img.Nombre ?? img.nombre ?? 'Imagen'} loading="lazy" />
            </button>
          ))}
        </div>

        <div className="cdp-main">
          {mainImg ? (
            <img src={mainImg} alt={cortina.nombre ?? 'Cortina'} />
          ) : (
            <div className="cdp-noimg">🪟 Sin imagen</div>
          )}
        </div>
      </aside>

      {/* Columna derecha: info */}
      <section className="cdp-info">
        <div className="cdp-badges">
          <span className="cdp-badge best">MÁS VENDIDO</span>
          <span className={`cdp-badge tipo ${cortina.tipo?.toLowerCase() || 'default'}`}>{cortina.tipo || 'Tipo'}</span>
        </div>

        <h1 className="cdp-title">{cortina.nombre}</h1>

        {cortina.descripcion && (
          <p className="cdp-desc">{cortina.descripcion}</p>
        )}

        <div className="cdp-attrs">
          <div><strong>Dimensiones: </strong>{(cortina.altura || 0)} cm x {(cortina.ancho || 0)} cm</div>
          <div><strong>Stock: </strong>{stock > 0 ? `${stock} disponibles` : 'Agotado'}</div>
          {cortina.color && <div><strong>Color: </strong>{cortina.color}</div>}
          {cortina.material && <div><strong>Material: </strong>{cortina.material}</div>}
        </div>

        <div className="cdp-price-block">
          {cortina.precioAnterior && (
            <div className="cdp-old">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cortina.precioAnterior)}</div>
          )}
          <div className="cdp-price">{priceFmt}</div>
          {cortina.promo && <div className="cdp-off">{cortina.promo}</div>}
          <div className="cdp-cuotas">Hasta 6 cuotas sin interés* (demo)</div>
        </div>

        <div className="cdp-actions">
          <label className="cdp-qty">
            <span>Cantidad</span>
            <input
              type="number"
              min={1}
              max={Math.max(stock, 1)}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(stock || 1, Number(e.target.value) || 1)))}
            />
          </label>

          <button
            className={`cdp-add ${disabledAdd ? 'is-disabled' : ''}`}
            disabled={disabledAdd}
            onClick={onAddToCart}
          >
            {disabledAdd ? '❌ Agotado' : '🛒 Agregar al carrito'}
          </button>
        </div>

        {/* Info extra */}
        <ul className="cdp-extra">
          <li>🚚 Envío a todo el país</li>
          <li>🔄 Cambios y devoluciones dentro de 30 días</li>
          <li>🛡️ Garantía oficial</li>
        </ul>
      </section>
    </div>
  )
}
