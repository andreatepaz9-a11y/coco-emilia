import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { INSTAGRAM_URL } from '@/utilities/instagram'
import {
  ColorGallery,
  ColorPicker,
  ProductColorProvider,
  type ProductPhoto,
} from '@/components/Boutique/ProductColors'
import { imageUrl } from '@/components/Boutique/ProductGrid'
import { assignPhotoColors } from '@/utilities/colorSwatches'

type Args = {
  params: Promise<{ slug: string }>
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(value)

const queryProduct = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return docs[0] ?? null
})

const optionPills = (items: string[]) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((item) => (
      <li className="border border-input px-4 py-2 text-sm" key={item}>
        {item}
      </li>
    ))}
  </ul>
)

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const product = await queryProduct(decodeURIComponent(slug))
  if (!product) notFound()

  const category = typeof product.category === 'object' ? product.category : null
  const photos: ProductPhoto[] = assignPhotoColors(
    (product.images ?? []).map((item) => ({ color: item.color, url: imageUrl(item.image) })),
    product.colors ?? [],
  ).flatMap((photo, i) => {
    if (!photo.url) return []
    return [
      {
        url: photo.url,
        color: photo.color,
        alt: photo.color
          ? `${product.title}, color ${photo.color}`
          : i === 0
            ? product.title
            : `${product.title}, foto ${i + 1}`,
      },
    ]
  })

  return (
    <div className="container py-12 md:py-20">
      <nav aria-label="Ruta de navegación" className="mb-8 text-xs uppercase tracking-[0.14em]">
        <Link className="underline-offset-4 hover:underline" href="/">
          Inicio
        </Link>
        <span aria-hidden="true"> / </span>
        {category && (
          <>
            <Link
              className="underline-offset-4 hover:underline"
              href={`/coleccion/${category.slug}`}
            >
              {category.title}
            </Link>
            <span aria-hidden="true"> / </span>
          </>
        )}
        <span aria-current="page">{product.title}</span>
      </nav>

      <ProductColorProvider>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          {/* Fotos: al elegir un color, su foto pasa al primer lugar */}
          <ColorGallery photos={photos} />

          {/* Información: se queda a la vista al desplazarse en escritorio */}
          <div className="md:sticky md:top-32 md:self-start">
            {category && (
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">{category.title}</p>
            )}
            <h1 className="font-serif text-4xl leading-tight md:text-5xl">{product.title}</h1>

            <p className="mt-6 flex items-baseline gap-3 text-xl tabular-nums">
              <span>{formatPrice(product.price)}</span>
              {product.compareAtPrice ? (
                <span className="text-base text-muted-foreground line-through">
                  <span className="sr-only">Precio anterior </span>
                  {formatPrice(product.compareAtPrice)}
                </span>
              ) : null}
              {product.badge && (
                <span className="bg-oliva px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-verde">
                  {product.badge}
                </span>
              )}
            </p>

            {product.description && (
              <p className="mt-6 text-base leading-relaxed md:text-lg">{product.description}</p>
            )}

            {product.colors && product.colors.length > 0 && <ColorPicker colors={product.colors} />}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.18em]">
                  {product.sizes.length === 1 ? 'Talla disponible' : 'Tallas disponibles'}
                </h2>
                {optionPills(product.sizes)}
              </div>
            )}

            <a
              className="mt-10 inline-flex h-12 w-full items-center justify-center bg-primary px-8 text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90 md:w-auto"
              href={INSTAGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Pedir por Instagram
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Escríbenos por mensaje directo y dinos el nombre del producto, el color y la talla.
            </p>
          </div>
        </div>
      </ProductColorProvider>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const product = await queryProduct(decodeURIComponent(slug))
  if (!product) return { title: 'Producto | Coco Emilia' }
  return {
    title: `${product.title} | Coco Emilia`,
    description: product.description ?? undefined,
  }
}
