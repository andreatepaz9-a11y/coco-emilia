import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/utilities/instagram'
import { ProductGrid } from '@/components/Boutique/ProductGrid'

type Args = {
  params: Promise<{ categoria: string }>
}

const getCategory = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return docs[0] ? { id: docs[0].id, name: docs[0].title } : null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'categories', limit: 100, pagination: false })
  return docs.flatMap((category) => (category.slug ? [{ categoria: category.slug }] : []))
}

export default async function Page({ params: paramsPromise }: Args) {
  const { categoria } = await paramsPromise
  const category = await getCategory(categoria)
  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 48,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
    where: { category: { equals: category.id } },
  })

  return (
    <div className="container py-12 md:py-20">
      <nav aria-label="Ruta de navegación" className="mb-8 text-xs uppercase tracking-[0.14em]">
        <Link className="underline-offset-4 hover:underline" href="/">
          Inicio
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{category.name}</span>
      </nav>

      <h1 className="mb-12 font-serif text-5xl md:mb-16 md:text-6xl">{category.name}</h1>

      {docs.length > 0 ? (
        <ProductGrid products={docs} />
      ) : (
        <div className="max-w-xl">
          <p className="text-lg leading-relaxed">
            Estamos preparando esta colección. Mientras tanto, puedes ver las novedades en nuestro
            Instagram{' '}
            <a
              className="font-medium underline underline-offset-4 hover:no-underline"
              href={INSTAGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              @{INSTAGRAM_HANDLE}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            .
          </p>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { categoria } = await paramsPromise
  const category = await getCategory(categoria)
  return { title: category ? `${category.name} | Coco Emilia` : 'Colección | Coco Emilia' }
}
