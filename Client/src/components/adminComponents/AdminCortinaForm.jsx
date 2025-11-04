  import { useState, useEffect } from 'react'
  import './AdminCortinaForm.css'

  function AdminCortinaForm({ cortina, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
      nombre: '',
      tipo: 'roller',
      precio: '',
      descripcion: '',
      altura: '',
      ancho: '',
      stock: 0
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
      if (cortina) {
        setFormData({
          nombre: cortina.nombre || '',
          tipo: cortina.tipo || 'roller',
          precio: cortina.precio || '',
          descripcion: cortina.descripcion || '',
          altura: cortina.altura || '',
          ancho: cortina.ancho || '',
          stock: cortina.stock || 0
        })
      }
    }, [cortina])

    const tiposCortina = [
      'roller',
      'romana',
      'vertical', 
      'sunscreen',
      'blackout'
    ]

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    }

    const validateForm = () => {
      const newErrors = {}

      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido'
      }

      if (!formData.precio || formData.precio <= 0) {
        newErrors.precio = 'El precio debe ser mayor a 0'
      }

      if (!formData.altura || formData.altura <= 0) {
        newErrors.altura = 'La altura debe ser mayor a 0'
      }

      if (!formData.ancho || formData.ancho <= 0) {
        newErrors.ancho = 'El ancho debe ser mayor a 0'
      }

      if (formData.stock < 0) {
        newErrors.stock = 'El stock no puede ser negativo'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      
      if (!validateForm()) {
        return
      }

      const cortinaData = {
        ...formData,
        precio: parseFloat(formData.precio),
        altura: parseFloat(formData.altura),
        ancho: parseFloat(formData.ancho),
        stock: parseInt(formData.stock),
        create_at: cortina ? cortina.create_at : new Date().toISOString(),
        update_at: new Date().toISOString()
      }

      onSubmit(cortinaData)
    }

    return (
      <div className="admin-cortina-form">
        <div className="form-header">
          <h3>{cortina ? '✏️ Editar Cortina' : '➕ Nueva Cortina'}</h3>
          <button onClick={onCancel} className="close-button">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="cortina-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={errors.nombre ? 'error' : ''}
                placeholder="Ej: Cortina Roller Moderna"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
              >
                {tiposCortina.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio (€) *</label>
              <input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', e.target.value)}
                className={errors.precio ? 'error' : ''}
                placeholder="150.00"
              />
              {errors.precio && <span className="error-message">{errors.precio}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className={errors.stock ? 'error' : ''}
                placeholder="10"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="altura">Altura (cm) *</label>
              <input
                id="altura"
                type="number"
                min="0"
                value={formData.altura}
                onChange={(e) => handleInputChange('altura', e.target.value)}
                className={errors.altura ? 'error' : ''}
                placeholder="200"
              />
              {errors.altura && <span className="error-message">{errors.altura}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ancho">Ancho (cm) *</label>
              <input
                id="ancho"
                type="number"
                min="0"
                value={formData.ancho}
                onChange={(e) => handleInputChange('ancho', e.target.value)}
                className={errors.ancho ? 'error' : ''}
                placeholder="120"
              />
              {errors.ancho && <span className="error-message">{errors.ancho}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Describe las características de la cortina..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {cortina ? 'Actualizar' : 'Crear'} Cortina
            </button>
          </div>
        </form>
      </div>
    )
  }

  export default AdminCortinaForm
