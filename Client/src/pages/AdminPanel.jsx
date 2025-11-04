import { useState, useEffect } from 'react'
import { get, post, put, del } from '../api/http.js'
import AdminCortinaForm from '../components/adminComponents/AdminCortinaForm.jsx'
import AdminCortinaList from '../components/adminComponents/AdminCortinaList.jsx'

// ⬇️ NUEVO: formulario para subir y vincular imágenes
import AdminCortinaImagenAddForm from '../components/adminComponents/AdminCortinaImagenAddForm.jsx'

import './AdminPanel.css'

function AdminPanel () {
  const [cortinas, setCortinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('cortinas')

  const [editingCortina, setEditingCortina] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // 🔗 modal de “subir y vincular”
  const [linkAddModal, setLinkAddModal] = useState({ open: false, cortinaId: null })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cortinasData] = await Promise.all([
        get('/cortinas'),
      ])
      setCortinas(Array.isArray(cortinasData) ? cortinasData : [])
    } catch (e) {
      setError('Error al cargar los datos: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCortina = async (cortinaData) => {
    try {
      const newCortina = await post('/cortinas', cortinaData)
      setCortinas(prev => [...prev, newCortina])
      setShowForm(false)
      setEditingCortina(null)
    } catch (e) {
      setError('Error al crear cortina: ' + e.message)
    }
  }

  const handleUpdateCortina = async (id, cortinaData) => {
    try {
      const updated = await put(`/cortinas/${id}`, cortinaData)
      setCortinas(prev => prev.map(c => c.id === id ? updated : c))
      setShowForm(false)
      setEditingCortina(null)
    } catch (e) {
      setError('Error al actualizar cortina: ' + e.message)
    }
  }

  const handleDeleteCortina = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta cortina?')) return
    try {
      await del(`/cortinas/${id}`)
      setCortinas(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      setError('Error al eliminar cortina: ' + e.message)
    }
  }

  const handleEditCortina = (cortina) => {
    setEditingCortina(cortina)
    setShowForm(true)
  }

  const handleNewCortina = () => {
    setEditingCortina(null)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingCortina(null)
  }

  // 🔗 abrir/cerrar “subir y vincular”
  const openAddAndLinkImages = (cortinaId) => {
    setLinkAddModal({ open: true, cortinaId })
  }
  const closeAddAndLinkImages = () => {
    setLinkAddModal({ open: false, cortinaId: null })
  }
  const handleAddAndLinkDone = async () => {
    closeAddAndLinkImages()
    await loadData() // opcional: refrescar catálogo
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ Panel de Administración</h1>
        <p>Gestiona tu catálogo de cortinas</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'cortinas' ? 'active' : ''}`}
          onClick={() => setActiveTab('cortinas')}
        >
          🪟 Cortinas ({cortinas.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'cortinas' && (
          <div className="cortinas-admin">
            <div className="admin-actions">
              <button
                className="add-button"
                onClick={handleNewCortina}
              >
                ➕ Nueva Cortina
              </button>
            </div>

            {showForm && (
              <div className="form-overlay">
                <div className="form-container">
                  <AdminCortinaForm
                    cortina={editingCortina}
                    onSubmit={editingCortina
                      ? (data) => handleUpdateCortina(editingCortina.id, data)
                      : handleCreateCortina
                    }
                    onCancel={handleCancelForm}
                  />
                </div>
              </div>
            )}

            <AdminCortinaList
              cortinas={cortinas}
              onEdit={handleEditCortina}
              onDelete={handleDeleteCortina}
              // ⬇️ NUEVO: la lista llamará a este handler con el id de la cortina
              onLinkImages={openAddAndLinkImages}
            />
          </div>
        )}
      </div>

      {/* 🔗 Modal “Subir y vincular imágenes” */}
      {linkAddModal.open && (
        <div className="form-overlay">
          <div className="form-container">
            <AdminCortinaImagenAddForm
              cortinaId={linkAddModal.cortinaId}
              onDone={handleAddAndLinkDone}
              onCancel={closeAddAndLinkImages}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
