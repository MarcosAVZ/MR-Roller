// CortinaModel.js (ESM)
import { pool } from '../Conexion/Sql.js'

// Mapea columnas SQL -> shape anterior (propiedades con mayúscula)
const mapRow = (r) => ({
  ID: r.id,
  Nombre: r.nombre,
  Tipo: r.tipo,
  Precio: r.precio,
  Descripcion: r.descripcion,
  Altura: r.altura,
  Ancho: r.ancho,
  Stock: r.stock,
  CreatedAt: r.created_at,
  UpdatedAt: r.updated_at
})

// Campos permitidos para INSERT/UPDATE
const ALLOWED_FIELDS = new Set([
  'Nombre', 'Tipo', 'Precio', 'Descripcion', 'Altura', 'Ancho', 'Stock',
  'nombre', 'tipo', 'precio', 'descripcion', 'altura', 'ancho', 'stock'
])

// Helper para normalizar input (keys del API -> columnas SQL)
function toDbFields (input = {}) {
  const out = {}

  if ('nombre' in input || 'Nombre' in input) out.nombre = input.nombre ?? input.Nombre
  if ('tipo' in input || 'Tipo' in input) out.tipo = input.tipo ?? input.Tipo
  if ('precio' in input || 'Precio' in input) out.precio = input.precio ?? input.Precio
  if ('descripcion' in input || 'Descripcion' in input) out.descripcion = input.descripcion ?? input.Descripcion
  if ('altura' in input || 'Altura' in input) out.altura = input.altura ?? input.Altura
  if ('ancho' in input || 'Ancho' in input) out.ancho = input.ancho ?? input.Ancho
  if ('stock' in input || 'Stock' in input) out.stock = input.stock ?? input.Stock

  return out
}

export class CortinaModel {
  static async getAll ({ tipo, categorias } = {}) {
    const where = []
    const params = []

    if (typeof tipo === 'string' && tipo.trim() !== '') {
      where.push('LOWER(TRIM(c.tipo)) = LOWER(TRIM(?))')
      params.push(tipo.trim())
    }

    // Si hay categorías, armamos join + group by + having
    let sqlBase = `
      SELECT
        c.id, c.nombre, c.tipo, c.precio, c.descripcion,
        c.altura, c.ancho, c.stock, c.created_at, c.updated_at
      FROM cortina c
    `

    let having = ''
    if (categorias && String(categorias).trim() !== '') {
      const catIds = Array.isArray(categorias)
        ? categorias.map(String)
        : String(categorias).split(',').map(s => s.trim()).filter(Boolean)

      if (catIds.length > 0) {
        // Unimos a la tabla puente y exigimos que cuente todas las categorías indicadas
        sqlBase += `
          JOIN cortina_categoria cc
            ON cc.id_cortina = c.id
            AND cc.id_categoria IN (${catIds.map(() => '?').join(',')})
        `
        params.push(...catIds)
        having = ` HAVING COUNT(DISTINCT cc.id_categoria) = ${catIds.length} `
      }
    }

    const whereSql = where.length ? ` WHERE ${where.join(' AND ')} ` : ''
    const groupSql = categorias ? ' GROUP BY c.id ' : ''
    const orderSql = ' ORDER BY c.nombre ASC '

    const sql = sqlBase + whereSql + groupSql + having + orderSql

    const [rows] = await pool.query(sql, params)
    return rows.map(mapRow)
  }

  static async getById ({ id }) {
    const [rows] = await pool.query(
      `
      SELECT
        c.id, c.nombre, c.tipo, c.precio, c.descripcion,
        c.altura, c.ancho, c.stock, c.created_at, c.updated_at
      FROM cortina c
      WHERE c.id = ?
      LIMIT 1
      `,
      [String(id)]
    )
    return rows.length ? mapRow(rows[0]) : null
  }

  static async create (input) {
    // mapear payload
    const data = toDbFields(input)

    // validar requeridos que tu DDL marca como NOT NULL
    const required = ['nombre', 'tipo', 'precio', 'altura', 'ancho']
    const missing = required.filter(k => data[k] === undefined)
    if (missing.length) {
      const err = new Error(`Faltan campos requeridos: ${missing.join(', ')}`)
      err.status = 400
      throw err
    }

    // id desde MySQL para no depender de randomUUID()
    const [[{ uuid }]] = await pool.query('SELECT UUID() AS uuid')

    const cols = Object.keys(data)
    const vals = Object.values(data)
    const placeholders = cols.map(() => '?').join(', ')
    const colList = cols.join(', ')

    try {
      await pool.execute(
        `INSERT INTO cortina (id, ${colList}) VALUES (?, ${placeholders})`,
        [uuid, ...vals]
      )
    } catch (e) {
      // log interno y rethrow con detalle SQL
      console.error('INSERT cortina error', e)
      const err = new Error(e.sqlMessage || e.message)
      err.status = 500
      throw err
    }

    return await this.getById({ id: uuid })
  }

  static async update ({ id, input }) {
    if (!id) return null

    // Filtramos sólo campos permitidos
    const clean = {}
    for (const k of Object.keys(input || {})) {
      if (ALLOWED_FIELDS.has(k)) clean[k] = input[k]
    }
    const data = toDbFields(clean)
    const cols = Object.keys(data)
    const vals = Object.values(data)

    if (cols.length === 0) {
      // nada para actualizar
      return await this.getById({ id })
    }

    const setSql = cols.map(c => `${c} = ?`).join(', ')
    const sql = `UPDATE cortina SET ${setSql} WHERE id = ?`

    const [res] = await pool.execute(sql, [...vals, String(id)])
    if (res.affectedRows === 0) return null

    return await this.getById({ id })
  }

  static async delete ({ id }) {
    if (!id) return false
    const [res] = await pool.execute(
      'DELETE FROM cortina WHERE id = ?',
      [String(id)]
    )
    return res.affectedRows > 0
  }
}
