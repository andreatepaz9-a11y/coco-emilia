// Sube a Vercel Blob las fotos que la base de datos tiene registradas en "Archivos"
// (el original y todas sus versiones reducidas), con el mismo nombre de archivo.
//
// Uso:  node scripts/subir-fotos-a-blob.mjs
//   Necesita BLOB_READ_WRITE_TOKEN en .env.local (vercel env pull) y la carpeta public/media.
import 'dotenv/config'
import { createClient } from '@libsql/client'
import { put } from '@vercel/blob'
import { config } from 'dotenv'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

config({ path: '.env.local', override: true })

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Falta BLOB_READ_WRITE_TOKEN. Ejecuta primero: npx vercel env pull .env.local --yes')
  process.exit(1)
}

const db = createClient({ url: process.env.SOURCE_DATABASE_URL || 'file:./mi-proyecto-nuevo.db' })
const columns = (await db.execute('PRAGMA table_info(media)')).rows
  .map((c) => String(c.name))
  .filter((name) => name === 'filename' || /^sizes_.*_filename$/.test(name))

const rows = (await db.execute(`SELECT ${columns.join(', ')} FROM media`)).rows
const filenames = [...new Set(rows.flatMap((row) => columns.map((c) => row[c]).filter(Boolean).map(String)))]

const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' }
let uploaded = 0
const missing = []

for (const filename of filenames) {
  const file = path.join('public', 'media', filename)
  if (!existsSync(file)) {
    missing.push(filename)
    continue
  }
  // addRandomSuffix en false: Payload necesita encontrar el archivo con su nombre exacto
  await put(filename, readFileSync(file), {
    access: 'public',
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: types[path.extname(filename).toLowerCase()] ?? 'application/octet-stream',
  })
  uploaded++
  console.log(`  subida: ${filename}`)
}

console.log(`Listo: ${uploaded} archivos subidos de ${filenames.length} registrados.`)
if (missing.length > 0) {
  // Suelen ser las imágenes de ejemplo de la plantilla (image-hero1, image-post1…), que nunca existieron
  console.warn(`Aviso: ${missing.length} archivos registrados no están en public/media y no se subieron:`)
  for (const m of missing) console.warn(`  - ${m}`)
}
