import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'cortinas_db',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
})
