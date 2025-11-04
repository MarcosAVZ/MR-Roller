import { useEffect, useState } from 'react'

export function useCortinaImages (id) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) { setImages([]); return }
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)

    fetch(`/cortinas/${encodeURIComponent(id)}/imagenes`, { signal: ctrl.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${res.statusText}`)))
      .then(arr => setImages(Array.isArray(arr) ? arr : []))
      .catch(e => { if (e.name !== 'AbortError') setError(e) })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [id])

  return { images, loading, error }
}
