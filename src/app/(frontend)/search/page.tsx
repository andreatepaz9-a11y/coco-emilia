import type { Metadata } from 'next/types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { boutiqueCategories, categoryHref } from '@/components/Boutique/categories'
import { ProductGrid } from '@/components/Boutique/ProductGrid'

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}

// "Joyería" y "joyeria" deben encontrar lo mismo
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q } = await searchParamsPromise
  const query = q?.trim() ?? ''
  const payload = await getPayload({ config: configPromise })

  const matchingCategory = query
    ? boutiqueCategories.find(
        (category) =>
          normalize(category.name) === normalize(query) || category.slug === normalize(query),
      )
    : undefined

  const where: Where = query
    ? {
        or: [
          { title: { like: query } },
          { description: { like: query } },
          ...(matchingCategory ? [{ category: { equals: matchingCategory.slug } }] : []),
        ],
      }
    : {}

  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 48,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
    where,
  })

  return (
    <div className="container py-12 md:py-20">
      <h1 className="mb-10 text-center font-serif text-5xl md:text-6xl">Buscar</h1>

      <form action="/search" className="mx-auto mb-14 flex max-w-2xl gap-2" method="get" role="search">
        <label className="sr-only" htmlFor="buscar">
          Buscar productos
        </label>
        <input
          className="h-12 min-w-0 flex-1 border border-input bg-background px-4 text-base"
          defaultValue={query}
          id="buscar"
          name="q"
          placeholder="Buscar productos, por ejemplo: anillo"
          type="search"
        />
        <button
          className="h-12 cursor-pointer bg-primary px-6 text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          type="submit"
        >
          Buscar
        </button>
      </form>

      {docs.length > 0 ? (
        <>
          {query && (
            <p className="mb-8 text-sm" role="status">
              {docs.length === 1 ? '1 resultado' : `${docs.length} resultados`} para “{query}”
            </p>
          )}
          <ProductGrid products={docs} />
        </>
      ) : (
        <div className="mx-auto max-w-xl text-center">
          <p className="text-lg" role="status">
            {query
              ? `No encontramos productos para “${query}”. Prueba con otra palabra o explora las colecciones.`
              : 'Aún no hay productos para mostrar. Explora las colecciones.'}
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {boutiqueCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  className="inline-flex h-11 items-center border border-primary px-5 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200 hover:bg-rosa"
                  href={categoryHref(category)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Buscar | Coco Emilia',
  }
}
