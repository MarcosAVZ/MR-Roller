// TelaModel.js — versión SQL sin punto y coma
import { randomUUID } from 'crypto'
import { pool } from '../Conexion/Sql.js'

// Mapea columnas SQL -> shape previo (ID, Nombre, SRC)
const mapRow = r => ({
  ID: r.id,
  Nombre: r.nombre,
  SRC: r.imagen
})

// campos permitidos para PATCH
const ALLOWED_FIELDS = new Set(['Nombre', 'SRC', 'nombre', 'imagen', 'src'])

// normaliza keys del input -> columnas SQL
function toDbFields (input = {}) {
  const out = {}
  if ('nombre' in input || 'Nombre' in input) out.nombre = input.nombre ?? input.Nombre
  // permití 'src' por compatibilidad, lo mapeamos a columna 'imagen'
  if ('src' in input || 'SRC' in input) out.imagen = input.src ?? input.SRC
  // si alguien manda 'imagen' directo, lo respetamos
  if ('imagen' in input) out.imagen = input.imagen
  return out
}

export class TelaModel {
  static async getAll () {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nombre,
        imagen
      FROM tela
      ORDER BY nombre ASC
      `
    )
    return rows.map(mapRow)
  }

  static async getById ({ id }) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nombre,
        imagen
      FROM tela
      WHERE id = ?
      LIMIT 1
      `,
      [String(id)]
    )
    return rows.length ? mapRow(rows[0]) : null
  }

  static async create ({ body, file }) {
    if (!file) throw new Error('No se recibió ninguna imagen de tela')
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:1234'

    const imageUrl = `${PUBLIC_BASE_URL}/uploads/${file.filename}`
    const id = randomUUID()

    const nombre = body?.nombre ?? body?.Nombre ?? null // ⬅️ tolerante

    await pool.execute(
      'INSERT INTO tela (id, nombre, imagen) VALUES (?, ?, ?)',
      [id, nombre, imageUrl]
    )

    return await this.getById({ id })
  }

  static async update ({ id, input = {}, file = null }) {
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:1234'
    if (!id) return null

    // filtramos sólo campos permitidos del payload
    const clean = {}
    for (const k of Object.keys(input)) {
      if (ALLOWED_FIELDS.has(k)) clean[k] = input[k]
    }

    // si viene archivo, prioriza nuevo src generado por el upload → columna 'imagen'
    if (file) {
      clean.imagen = `${PUBLIC_BASE_URL}/uploads/${file.filename}`
    }

    const data = toDbFields(clean)
    const cols = Object.keys(data)
    const vals = Object.values(data)

    if (cols.length === 0) {
      // nada para actualizar → devolvemos la fila actual
      const [rows] = await pool.query(
        'SELECT id, nombre, imagen FROM tela WHERE id = ? LIMIT 1',
        [String(id)]
      )
      return rows.length
        ? { ID: rows[0].id, Nombre: rows[0].nombre, SRC: rows[0].imagen }
        : null
    }

    const setSql = cols.map(c => `${c} = ?`).join(', ')
    const sql = `UPDATE tela SET ${setSql} WHERE id = ?`

    const [res] = await pool.execute(sql, [...vals, String(id)])
    if (res.affectedRows === 0) return null

    const [rows2] = await pool.query(
      'SELECT id, nombre, imagen FROM tela WHERE id = ? LIMIT 1',
      [String(id)]
    )
    return rows2.length
      ? { ID: rows2[0].id, Nombre: rows2[0].nombre, SRC: rows2[0].imagen }
      : null
  }

  static async delete ({ id }) {
    // Si hay FK desde cortina_tela con ON DELETE CASCADE, se limpian relaciones
    const [res] = await pool.execute(
      `
      DELETE FROM tela
      WHERE id = ?
      `,
      [String(id)]
    )
    return res.affectedRows > 0
  }
}
