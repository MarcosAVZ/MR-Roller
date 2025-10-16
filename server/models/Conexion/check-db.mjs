// check-db.mjs
import { pool } from './Sql.js'

try {
  const [rows] = await pool.query('SELECT 1 AS ok')
  console.log('✅ Conectado:', rows)
} catch (e) {
  console.error('❌ No conecta:', e.message)
} finally {
  await pool.end()
}
