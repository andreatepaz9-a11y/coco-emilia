// Pasa la categoría de los productos de un texto fijo ("moda", "zapatos"...) a una relación con
// la colección "categories" de Payload.
//
// Uso:
//   node scripts/migrar-categoria-de-productos.mjs             Paso 1: agrega category_id y copia los datos
//   node scripts/migrar-categoria-de-productos.mjs --limpiar   Paso 3: borra la columna vieja (después de publicar el código nuevo)
//   Añade --nube para hacerlo en Turso (usa TURSO_* de .env.local); sin --nube usa la base local.
// Es seguro repetirlo: no hace nada que ya esté hecho.
import 'dotenv/config'
import { createClient } from '@libsql/client'
import { config } from 'dotenv'

const nube = process.argv.includes('--nube')
const limpiar = process.argv.includes('--limpiar')

if (nube) config({ path: '.env.local', override: true })

const db = createClient(
  nube
    ? { url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN }
    : { url: process.env.DATABASE_URL || 'file:./mi-proyecto-nuevo.db' },
)
console.log(nube ? 'Base: Turso (nube)' : 'Base: local')

const columns = async () =>
  (await db.execute('PRAGMA table_info(products)')).rows.map((row) => String(row.name))

let cols = await columns()
const hasOld = cols.includes('category')
const hasNew = cols.includes('category_id')

if (!hasNew) {
  await db.execute(
    'ALTER TABLE products ADD COLUMN category_id integer REFERENCES categories(id) ON DELETE SET NULL',
  )
  console.log('+ columna category_id agregada')
}

if (hasOld) {
  await db.execute(
    'UPDATE products SET category_id = (SELECT id FROM categories WHERE categories.slug = products.category) WHERE category_id IS NULL',
  )
}

const sinCategoria = await db.execute(
  hasOld
    ? 'SELECT id, title, category FROM products WHERE category_id IS NULL'
    : 'SELECT id, title FROM products WHERE category_id IS NULL',
)
if (sinCategoria.rows.length > 0) {
  console.error('Estos productos no encontraron su categoría en "categories":')
  for (const row of sinCategoria.rows) console.error(`  - ${row.title} (${row.category ?? 'sin dato'})`)
  console.error('Crea esas categorías en el admin (con el mismo slug) y vuelve a correr el script.')
  process.exit(1)
}
const total = (await db.execute('SELECT count(*) AS n FROM products')).rows[0].n
console.log(`= ${total} productos con su categoría copiada`)

if (limpiar) {
  if (hasOld) {
    await db.batch(
      [
        'DROP INDEX IF EXISTS products_category_idx',
        'ALTER TABLE products DROP COLUMN category',
      ],
      'write',
    )
    console.log('- columna vieja "category" eliminada')
  }
  await db.execute('CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_id)')
} else {
  console.log('Siguiente: publica el código nuevo y corre este script con --limpiar')
}
process.exit(0)
