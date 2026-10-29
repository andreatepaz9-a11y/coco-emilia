// Carga las categorías de la tienda (con sus fotos de public/brand) en la base de datos.
// Es idempotente: si la categoría ya existe por su slug, solo actualiza grupo y orden.
//
// Uso:  npx tsx scripts/sembrar-categorias.ts
//   Local (por defecto): archivo SQLite y public/media.
//   Nube: USE_REMOTE_DATA=1 npx tsx scripts/sembrar-categorias.ts  (necesita .env.local con las claves)
import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { getPayload } from 'payload'

if (process.env.USE_REMOTE_DATA === '1') loadEnv({ path: '.env.local', override: true })

const { default: payloadConfig } = await import('../src/payload.config')
const payload = await getPayload({ config: payloadConfig })

const categorias = [
  { slug: 'moda', title: 'Moda', group: 'ropa', image: 'moda.jpg', alt: 'Colección de moda' },
  { slug: 'deportiva', title: 'Deportiva', group: 'ropa', image: 'deportiva.jpg', alt: 'Colección de ropa deportiva' },
  { slug: 'pijamas', title: 'Pijamas', group: 'ropa', image: 'pijamas.jpg', alt: 'Colección de pijamas' },
  { slug: 'zapatos', title: 'Zapatos', group: 'accesorios', image: 'zapatos.jpg', alt: 'Colección de zapatos' },
  { slug: 'joyeria', title: 'Joyería', group: 'accesorios', image: 'joyeria.jpg', alt: 'Colección de joyería' },
  { slug: 'bolsos', title: 'Bolsos', group: 'accesorios', image: 'carteras.jpg', alt: 'Colección de bolsos y carteras' },
  { slug: 'cabello', title: 'Cabello', group: 'accesorios', image: 'cabello.jpg', alt: 'Accesorios y cuidado del cabello' },
] as const

for (const [index, c] of categorias.entries()) {
  const existente = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: c.slug } },
  })

  if (existente.docs[0]) {
    await payload.update({
      collection: 'categories',
      id: existente.docs[0].id,
      data: { group: c.group, order: index },
    })
    console.log(`= ${c.slug}: ya existía, grupo y orden actualizados`)
    continue
  }

  const foto = await payload.create({
    collection: 'media',
    data: { alt: c.alt },
    filePath: path.resolve(process.cwd(), 'public/brand', c.image),
  })
  await payload.create({
    collection: 'categories',
    data: { title: c.title, slug: c.slug, group: c.group, order: index, image: foto.id },
  })
  console.log(`+ ${c.slug}: creada`)
}

// En la nube también hay categorías de la plantilla (Technology, News...). Se les quita el grupo
// para que no salgan en la home; no se borran porque pueden estar usadas por posts.
if (process.env.USE_REMOTE_DATA === '1') {
  const slugs = categorias.map((c) => c.slug) as string[]
  const otras = await payload.find({
    collection: 'categories',
    limit: 200,
    pagination: false,
    where: { slug: { not_in: slugs } },
  })
  for (const otra of otras.docs) {
    if (!otra.group) continue
    await payload.update({ collection: 'categories', id: otra.id, data: { group: null } })
    console.log(`- ${otra.slug}: oculta de la home`)
  }
}

process.exit(0)
