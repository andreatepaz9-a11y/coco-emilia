import React from 'react'

import type { Media, Product } from '@/payload-types'

import { assignPhotoColors } from '@/utilities/colorSwatches'

import { getCategory } from './categories'
import { ProductCard } from './ProductCard'

export const imageUrl = (image: number | Media | null | undefined) =>
  image && typeof image === 'object' ? (image.url ?? null) : null

export const ProductGrid: React.FC<{ products: Product[]; compact?: boolean }> = ({
  products,
  compact,
}) => {
  return (
    <ul
      className={
        compact
          ? 'grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3'
          : 'grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8'
      }
    >
      {products.map((product) => {
        const main = imageUrl(product.images?.[0]?.image)
        if (!main) return null

        return (
          <li key={product.id}>
            <ProductCard
              compact={compact}
              badge={product.badge ?? undefined}
              category={getCategory(product.category)?.name ?? product.category}
              colorImages={assignPhotoColors(
                (product.images ?? []).map((item) => ({
                  color: item.color,
                  url: imageUrl(item.image),
                })),
                product.colors ?? [],
              ).flatMap((photo) =>
                photo.color && photo.url ? [{ color: photo.color, image: photo.url }] : [],
              )}
              colors={product.colors ?? undefined}
              compareAtPrice={product.compareAtPrice ?? undefined}
              description={product.description ?? undefined}
              hoverImage={imageUrl(product.images?.[1]?.image) ?? undefined}
              href={product.slug ? `/producto/${product.slug}` : undefined}
              image={main}
              imageAlt={product.title}
              name={product.title}
              price={product.price}
              sizes={product.sizes ?? undefined}
            />
          </li>
        )
      })}
    </ul>
  )
}
