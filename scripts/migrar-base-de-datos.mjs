// Copia la base de datos local (SQLite) a Turso, con su estructura y todos los datos.
//
// Uso:  node scripts/migrar-base-de-datos.mjs
//   Origen:  DATABASE_URL de .env (por defecto el archivo local)
//   Destino: TURSO_DATABASE_URL y TURSO_AUTH_TOKEN de .env.local (vercel env pull)
// Por seguridad se detiene si el destino ya tiene tablas (usa --force para sobrescribir).
import 'dotenv/config'
import { createClient } from '@libsql/client'
import { config } from 'dotenv'

config({ path: '.env.local', override: true })

const force = process.argv.includes('--force')
const sourceUrl = process.env.SOURCE_DATABASE_URL || 'file:./mi-proyecto-nuevo.db'
const destUrl = process.env.TURSO_DATABASE_URL
const destToken = process.env.TURSO_AUTH_TOKEN

if (!destUrl) {
  console.error('Falta TURSO_DATABASE_URL. Ejecuta primero: npx vercel env pull .env.local --yes')
  process.exit(1)
}

const source = createClient({ url: sourceUrl })
const dest = createClient({ url: destUrl, authToken: destToken })

const quote = (name) => `"${name.replace(/"/g, '""')}"`

const existing = await dest.execute(
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream%'",
)
if (existing.rows.length > 0 && !force) {
  console.error(`El destino ya tiene ${existing.rows.length} tablas. No se toca nada (usa --force para sobrescribir).`)
  process.exit(1)
}
if (force) {
  // Una sola secuencia (sin transacción) con las relaciones desactivadas: si no, SQLite no deja
  // borrar una tabla cuya tabla "padre" ya no existe
  const current = await dest.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream%'",
  )
  await dest.executeMultiple(
    ['PRAGMA foreign_keys = OFF', ...current.rows.map((row) => `DROP TABLE IF EXISTS ${quote(String(row.name))}`)].join(';\n'),
  )
}

const schema = await source.execute(
  "SELECT type, name, tbl_name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream%' ORDER BY CASE type WHEN 'table' THEN 0 ELSE 1 END, rowid",
)

await dest.execute('PRAGMA foreign_keys = OFF')
const tables = []
for (const row of schema.rows) {
  await dest.execute(String(row.sql))
  if (row.type === 'table') tables.push(String(row.name))
}
console.log(`Estructura creada: ${tables.length} tablas`)

// Turso se usa por internet: cada operación es una transacción aparte y `PRAGMA foreign_keys`
// no se conserva entre ellas. Por eso se arma todo en un solo lote y se difiere la verificación
// de relaciones hasta el final (así el orden de las tablas no importa). Con bases muy grandes
// habría que dividirlo, pero una tienda de este tamaño cabe de sobra en un lote.
const statements = []
let totalRows = 0
for (const table of tables) {
  const data = await source.execute(`SELECT * FROM ${quote(table)}`)
  if (data.rows.length === 0) continue
  const columns = data.columns
  const sql = `INSERT INTO ${quote(table)} (${columns.map(quote).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`
  for (const row of data.rows) statements.push({ sql, args: columns.map((c) => row[c]) })
  totalRows += data.rows.length
  console.log(`  ${table}: ${data.rows.length} filas`)
}

const BATCH = 2000
for (let i = 0; i < statements.length; i += BATCH) {
  await dest.batch(
    [{ sql: 'PRAGMA defer_foreign_keys = ON', args: [] }, ...statements.slice(i, i + BATCH)],
    'write',
  )
}

// Verificación: mismas filas en origen y destino
let mismatches = 0
for (const table of tables) {
  const a = (await source.execute(`SELECT COUNT(*) AS n FROM ${quote(table)}`)).rows[0].n
  const b = (await dest.execute(`SELECT COUNT(*) AS n FROM ${quote(table)}`)).rows[0].n
  if (Number(a) !== Number(b)) {
    mismatches++
    console.error(`  DIFERENCIA en ${table}: origen ${a}, destino ${b}`)
  }
}
await dest.execute('PRAGMA foreign_keys = ON')
console.log(mismatches === 0 ? `Listo: ${totalRows} filas copiadas y verificadas.` : `Terminó con ${mismatches} diferencias.`)
process.exit(mismatches === 0 ? 0 : 1)
