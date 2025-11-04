  import { useEffect, useState } from 'react'
  import { uploadFile, post } from '../../api/http'   // ya tenés estos helpers
  import './AdminCortinaForm.css'

  /**
   * Sube nuevas imágenes y las vincula a la cortina.
   * Requiere que el backend tenga:
   *  - POST /imagenes (multer.single('file')) -> devuelve { ID, Nombre, SRC }
   *  - POST /cortinas/:id/imagenes/link       -> body { imagenIds: [...] }
   */
  function AdminCortinaImagenAddForm({ cortinaId, onDone, onCancel }) {
    const [files, setFiles] = useState([])           // [{ file, nombreLocal, previewUrl }]
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')

    // liberar object URLs
    useEffect(() => {
      return () => files.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
    }, [files])

    const onPickFiles = (e) => {
      const picked = Array.from(e.target.files || []).map(f => ({
        file: f,
        nombreLocal: f.name.replace(/\.[^.]+$/, ''), // nombre default sin extensión
        previewUrl: URL.createObjectURL(f)
      }))
      setFiles(prev => [...prev, ...picked])
    }

    const changeNombreLocal = (idx, value) => {
      setFiles(prev => prev.map((f, i) => i === idx ? { ...f, nombreLocal: value } : f))
    }

    const removeAt = (idx) => {
      setFiles(prev => {
        const copy = [...prev]
        const [del] = copy.splice(idx, 1)
        if (del?.previewUrl) URL.revokeObjectURL(del.previewUrl)
        return copy
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')

      if (!cortinaId) {
        setError('Falta cortinaId')
        return
      }
      if (files.length === 0) {
        setError('Seleccioná al menos un archivo')
        return
      }

      try {
        setSending(true)

        // 1) subir cada archivo a /imagenes
        const createdIds = []
        for (const f of files) {
          const fd = new FormData()
          // el backend de /imagenes espera: file (multer.single('file')) y nombre
          fd.append('file', f.file)
          fd.append('nombre', f.nombreLocal || '')

          const created = await uploadFile('/imagenes', fd) // devuelve { ID, Nombre, SRC }
          const newId = created?.ID || created?.id
          if (!newId) {
            throw new Error('La API de /imagenes no devolvió un ID')
          }
          createdIds.push(newId)
        }

        // 2) vincular a la cortina
        await post(`/cortinas/${encodeURIComponent(cortinaId)}/imagenes/link`, {
          imagenIds: createdIds
        })

        // listo
        onDone?.({ cortinaId, attached: createdIds })
      } catch (err) {
        setError(err.message || 'Error subiendo y vinculando imágenes')
      } finally {
        setSending(false)
      }
    }

    return (
      <div className="admin-cortina-form">
        <div className="form-header">
          <h3>➕ Agregar y vincular imágenes</h3>
          <button onClick={onCancel} className="close-button">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="cortina-form">
          <div className="form-group">
            <label>Archivos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onPickFiles}
              disabled={sending}
            />
            <small>Podés seleccionar varias imágenes a la vez.</small>
          </div>

          {files.length > 0 && (
            <div className="images-preview">
              {files.map((f, idx) => (
                <div key={idx} className="image-chip">
                  {f.previewUrl
                    ? <img src={f.previewUrl} alt={f.file.name} />
                    : <div className="no-thumb">🖼️</div>
                  }
                  <div className="image-meta">
                    <input
                      type="text"
                      value={f.nombreLocal}
                      onChange={(e) => changeNombreLocal(idx, e.target.value)}
                      placeholder="Nombre de la imagen"
                      disabled={sending}
                    />
                    <div className="image-name">{f.file.name}</div>
                    <button
                      type="button"
                      onClick={() => removeAt(idx)}
                      className="small danger"
                      disabled={sending}
                    >
                      Eliminar
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
            <button type="button" onClick={onCancel} className="cancel-button" disabled={sending}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={sending}>
              {sending ? 'Subiendo…' : 'Subir y vincular'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  export default AdminCortinaImagenAddForm
