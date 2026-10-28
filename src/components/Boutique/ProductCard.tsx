'use client'
import { cn } from '@/utilities/ui'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { sameColor } from '@/utilities/colorSwatches'
import { formatList } from '@/utilities/formatList'

import { ColorSwatches } from './ColorSwatches'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'

export type ProductCardProps = {
  href?: string
  name: string
  price: number
  compareAtPrice?: number
  category: string
  image: string
  imageAlt: string
  hoverImage?: string
  badge?: 'Nuevo' | 'Oferta'
  /** Descripción corta. Ej.: "Anillo con diamante" */
  description?: string
  /** Ej.: ["rosa", "amarillo", "café"] */
  colors?: string[]
  /** Foto que corresponde a cada color; al elegir el color, la tarjeta muestra esa foto */
  colorImages?: { color: string; image: string }[]
  /** Ej.: ["5", "6", "7"] o ["S", "M", "L"] */
  sizes?: string[]
  /** Versión reducida: solo foto, nombre y precio */
  compact?: boolean
  className?: string
}

// La tienda vende solo en Guatemala, en quetzales
const STORE_CURRENCY = 'GTQ'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: STORE_CURRENCY }).format(value)

const sizesText = (sizes: string[]) =>
  sizes.length === 1 ? `Talla ${sizes[0]}` : `Tallas ${formatList(sizes)}`

export const ProductCard: React.FC<ProductCardProps> = ({
  href,
  name,
  price,
  compareAtPrice,
  category,
  image,
  imageAlt,
  hoverImage,
  badge,
  description,
  colors,
  colorImages,
  sizes,
  compact,
  className,
}) => {
  const [saved, setSaved] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Foto del color elegido; si ese color no tiene foto propia, se queda la principal
  const colorImage = selectedColor
    ? colorImages?.find((item) => sameColor(item.color, selectedColor))?.image
    : undefined
  const mainImage = colorImage ?? image
  const showHover = Boolean(hoverImage) && !colorImage

  const toggleColor = (color: string) =>
    setSelectedColor((current) => (current && sameColor(current, color) ? null : color))

  return (
    <article className={cn('group relative', className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-crema">
        <Image
          alt={imageAlt}
          className={cn(
            'object-cover transition-opacity duration-300',
            showHover && 'group-hover:opacity-0 group-focus-within:opacity-0',
          )}
          fill
          key={mainImage}
          quality={IMAGE_QUALITY}
          sizes="(min-width: 1024px) 25vw, 50vw"
          src={mainImage}
        />
        {showHover && hoverImage && (
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            fill
            quality={IMAGE_QUALITY}
            sizes="(min-width: 1024px) 25vw, 50vw"
            src={hoverImage}
          />
        )}

        {badge && (
          <span className="absolute left-3 top-3 bg-oliva px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-verde">
            {badge}
          </span>
        )}

        <button
          aria-label={saved ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
          aria-pressed={saved}
          className="absolute right-1 top-1 z-10 flex size-11 cursor-pointer items-center justify-center text-verde transition-transform duration-200 hover:scale-110 motion-reduce:transition-none"
          onClick={() => setSaved((value) => !value)}
          type="button"
        >
          <Heart aria-hidden="true" className={cn('size-5', saved && 'fill-verde')} />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        {!compact && (
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {category}
          </p>
        )}
        <h3 className="text-base font-medium">
          {/* El enlace se extiende sobre toda la tarjeta; el corazón queda por encima (z-10) */}
          {href ? (
            <Link className="after:absolute after:inset-0" href={href}>
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>
        <p className="flex items-baseline gap-2 text-sm tabular-nums">
          <span>{formatPrice(price)}</span>
          {compareAtPrice && (
            <span className="text-muted-foreground line-through">
              <span className="sr-only">Precio anterior </span>
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </p>
        {!compact && description && <p className="text-sm">{description}</p>}
        {!compact && colors && colors.length > 0 && (
          <ColorSwatches colors={colors} onSelect={toggleColor} selected={selectedColor} />
        )}
        {!compact && colors && colors.length > 0 && (
          <p aria-live="polite" className="min-h-5 text-sm capitalize">
            {selectedColor ? `Color: ${selectedColor}` : null}
          </p>
        )}
        {!compact && sizes && sizes.length > 0 && (
          <p className="text-sm text-muted-foreground">{sizesText(sizes)}</p>
        )}
      </div>
    </article>
  )
}
