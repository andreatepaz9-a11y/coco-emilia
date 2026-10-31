import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export type PaginaMenu = { href: string; id: number; title: string }

export const getPaginasMenu = cache(async (): Promise<PaginaMenu[]> => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 20,
    pagination: false,
    select: { title: true, slug: true, etiquetaMenu: true },
    sort: 'createdAt',
    where: { and: [{ mostrarEnMenu: { equals: true } }, { slug: { not_equals: 'home' } }] },
  })

  return docs
    .filter((page) => page.slug)
    .map((page) => ({
      href: `/${page.slug}`,
      id: page.id,
      title: page.etiquetaMenu?.trim() || page.title,
    }))
})
