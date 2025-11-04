import { useEffect, useMemo, useState } from 'react'
import { get, post, del, patch, uploadFile } from '../../api/http'
import './AdminCortinaForm.css'

/**
 * AdminCortinaImagenManager
 * - Muestra imágenes YA vinculadas a una cortina (GET /cortinas/:id/imagenes)
 * - Permite renombrar cada imagen (PATCH /imagenes/:imagenId { nombre })
 * - Permite desvincular una imagen (DELETE /cortinas/:id/imagenes/:imagenId)
 * - Permite subir nuevas imágenes y vincularlas (POST /imagenes + POST /cortinas/:id/imagenes/link)
 */
function AdminCortinaImagenManager({ cortinaId, onDone, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [linked, setLinked] = useState([]) // [{ ID, Nombre, SRC }]
  const [dirtyNames, setDirtyNames] = useState({}) // { [imagenId]: 'nuevo nombre' }

  // para nuevas imágenes por subir
  const [files, setFiles] = useState([]) // [{ file, nombreLocal, previewUrl }]

  useEffect(() => {
    if (!cortinaId) return
    const fetchLinked = async () => {
      setError('')
      setLoading(true)
      try {
        const data = await get(`/cortinas/${encodeURIComponent(cortinaId)}/imagenes`)
        // normaliza posibles campos
        const rows = Array.isArray(data) ? data : (data?.items || [])
        setLinked(rows)
      } catch (e) {
        setError(e?.message || 'No se pudieron cargar las imágenes vinculadas')
      } finally {
        setLoading(false)
      }
    }
    fetchLinked()
  }, [cortinaId])

  // ------- renombrar -------
  const setNombreEdit = (imagenId, value) => {
    setDirtyNames(prev => ({ ...prev, [imagenId]: value }))
  }

  const saveNombre = async (imagenId) => {
    const nuevo = (dirtyNames[imagenId] ?? '').trim()
    if (!nuevo) return
    setSaving(true)
    setError('')
    try {
      await patch(`/imagenes/${encodeURIComponent(imagenId)}`, { nombre: nuevo })
      // refleja en UI
      setLinked(prev => prev.map(img => img.ID === imagenId || img.id === imagenId
        ? { ...img, Nombre: nuevo, nombre: nuevo }
        : img
      ))
      setDirtyNames(prev => {
        const { [imagenId]: _, ...rest } = prev
        return rest
      })
    } catch (e) {
      setError(e?.message || 'No se pudo actualizar el nombre')
    } finally {
      setSaving(false)
    }
  }

  // ------- desvincular -------
  const unlinkImagen = async (imagenId) => {
    if (!confirm('¿Desvincular esta imagen de la cortina?')) return
    setSaving(true)
    setError('')
    try {
      await del(`/cortinas/${encodeURIComponent(cortinaId)}/imagenes/${encodeURIComponent(imagenId)}`)
      setLinked(prev => prev.filter(img => (img.ID ?? img.id) !== imagenId))
      // por si estaba en edición de nombre
      setDirtyNames(prev => {
        const { [imagenId]: _, ...rest } = prev
        return rest
      })
    } catch (e) {
      setError(e?.message || 'No se pudo desvincular la imagen')
    } finally {
      setSaving(false)
    }
  }

  // ------- manejo de nuevos archivos -------
  useEffect(() => {
    return () => files.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
  }, [files])

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []).map(f => ({
      file: f,
      nombreLocal: f.name.replace(/\.[^.]+$/, ''),
      previewUrl: URL.createObjectURL(f)
    }))
    setFiles(prev => [...prev, ...picked])
  }

  const changeNombreLocal = (idx, value) => {
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, nombreLocal: value } : f))
  }

  const removeNewAt = (idx) => {
    setFiles(prev => {
      const copy = [...prev]
      const [del] = copy.splice(idx, 1)
      if (del?.previewUrl) URL.revokeObjectURL(del.previewUrl)
      return copy
    })
  }

  const submitNewAndLink = async (e) => {
    e?.preventDefault?.()
    setError('')
    if (!cortinaId) {
      setError('Falta cortinaId')
      return
    }
    if (files.length === 0) {
      setError('Seleccioná al menos un archivo nuevo')
      return
    }
    setSaving(true)
    try {
      const createdIds = []
      for (const f of files) {
        const fd = new FormData()
        fd.append('file', f.file)
        fd.append('nombre', f.nombreLocal || '')
        const created = await uploadFile('/imagenes', fd) // -> { ID, Nombre, SRC }
        const newId = created?.ID || created?.id
        if (!newId) throw new Error('La API de /imagenes no devolvió un ID')
        createdIds.push(newId)
      }
      await post(`/cortinas/${encodeURIComponent(cortinaId)}/imagenes/link`, {
        imagenIds: createdIds
      })
      // refresca listado
      const data = await get(`/cortinas/${encodeURIComponent(cortinaId)}/imagenes`)
      const rows = Array.isArray(data) ? data : (data?.items || [])
      setLinked(rows)
      // limpia seleccionados
      setFiles(prev => {
        prev.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
        return []
      })
      onDone?.({ cortinaId, attached: createdIds })
    } catch (e) {
      setError(e?.message || 'Error subiendo y vinculando imágenes')
    } finally {
      setSaving(false)
    }
  }

  const linkedCount = useMemo(() => linked.length, [linked])

  return (
    <div className="admin-cortina-form">
      <div className="form-header">
        <h3>🖼️ Imágenes de la cortina</h3>
        <button onClick={onCancel} className="close-button">✕</button>
      </div>

      {loading ? (
        <p>Cargando imágenes vinculadas…</p>
      ) : (
        <>
          <div className="form-group">
            <label>Imágenes vinculadas ({linkedCount})</label>
            {linkedCount === 0 && <small>No hay imágenes vinculadas aún.</small>}

            <div className="images-preview">
              {linked.map((img) => {
                const imagenId = img.ID ?? img.id
                const nombreActual = img.Nombre ?? img.nombre ?? ''
                const src = img.SRC ?? img.src
                const editValue = (imagenId in dirtyNames) ? dirtyNames[imagenId] : nombreActual
                return (
                  <div key={imagenId} className="image-chip">
                    {src ? <img src={src} alt={nombreActual} /> : <div className="no-thumb">🖼️</div>}
                    <div className="image-meta">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setNombreEdit(imagenId, e.target.value)}
                        placeholder="Nombre de la imagen"
                        disabled={saving}
                      />
                      <div className="row gap-8">
                        <button
                          type="button"
                          className="small"
                          onClick={() => saveNombre(imagenId)}
                          disabled={saving || !dirtyNames[imagenId]?.trim()}
                        >
                          Guardar nombre
                        </button>
                        <button
                          type="button"
                          className="small danger"
                          onClick={() => unlinkImagen(imagenId)}
                          disabled={saving}
                        >
                          Desvincular
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <hr />

          <form onSubmit={submitNewAndLink} className="cortina-form">
            <div className="form-group">
              <label>Agregar nuevas imágenes</label>
              <input type="file" accept="image/*" multiple onChange={onPickFiles} disabled={saving} />
              <small>Se subirán y quedarán vinculadas a esta cortina.</small>
            </div>

            {files.length > 0 && (
              <div className="images-preview">
                {files.map((f, idx) => (
                  <div key={idx} className="image-chip">
                    {f.previewUrl ? <img src={f.previewUrl} alt={f.file.name} /> : <div className="no-thumb">🖼️</div>}
                    <div className="image-meta">
                      <input
                        type="text"
                        value={f.nombreLocal}
                        onChange={(e) => changeNombreLocal(idx, e.target.value)}
                        placeholder="Nombre de la imagen"
                        disabled={saving}
                      />
                      <div className="image-name">{f.file.name}</div>
                      <button
                        type="button"
                        className="small danger"
                        onClick={() => removeNewAt(idx)}
                        disabled={saving}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="error-container" style={{ marginTop: 8 }}>
                <p>❌ {error}</p>
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="cancel-button" disabled={saving}>
                Cerrar
              </button>
              <button type="submit" className="submit-button" disabled={saving || files.length === 0}>
                {saving ? 'Guardando…' : 'Subir y vincular nuevas'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default AdminCortinaImagenManager
  