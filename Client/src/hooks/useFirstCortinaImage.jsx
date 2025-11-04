// hooks/useFirstCortinaImage.js
import { useEffect, useState } from 'react'
import { get } from '../api/http'

// Trae la PRIMER imagen de la cortina
export function useFirstCortinaImage(cortinaId) {
  const [imagen, setImagen] = useState(null) // { ID/Nombre/SRC } o null
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!cortinaId) return
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        const imgs = await get(`/cortinas/${encodeURIComponent(cortinaId)}/imagenes`)
        if (!alive) return
        const first = (Array.isArray(imgs) ? imgs : [])[0] ?? null
        setImagen(first)
      } catch (e) {
        if (alive) setError(e.message || 'Error cargando imagen')
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => { alive = false }
  }, [cortinaId])

  return { imagen, loading, error }
}
