import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { categoryGroups } from '@/collections/categoryGroups'

export const categoryHref = (category: { slug?: string | null }) => `/coleccion/${category.slug}`

// Categorías visibles en la tienda: las que tienen grupo, ordenadas por grupo y por "orden".
// Se consulta una sola vez por petición aunque la pidan varios componentes.
export const getCategories = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'order',
    where: { group: { exists: true } },
  })

  const groupIndex = (id: string | null | undefined) =>
    categoryGroups.findIndex((group) => group.id === id)

  return docs
    .filter((category) => category.slug && groupIndex(category.group) !== -1)
    .sort(
      (a, b) =>
        groupIndex(a.group) - groupIndex(b.group) || (a.order ?? 0) - (b.order ?? 0) || a.id - b.id,
    )
})
