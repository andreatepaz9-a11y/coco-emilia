'use client'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'
import { sameColor } from '@/utilities/colorSwatches'

import { ColorSwatches } from './ColorSwatches'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'

export type ProductPhoto = { url: string; alt: string; color?: string | null }

type ColorState = {
  selected: string | null
  toggle: (color: string) => void
}

const ColorContext = createContext<ColorState | null>(null)

const useColor = () => {
  const context = useContext(ColorContext)
  if (!context) throw new Error('Falta ProductColorProvider')
  return context
}

/** Comparte el color elegido entre la galería y el selector de la página del producto */
export const ProductColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<string | null>(null)

  const value = useMemo<ColorState>(
    () => ({
      selected,
      toggle: (color) =>
        setSelected((current) => (current && sameColor(current, color) ? null : color)),
    }),
    [selected],
  )

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
}

// Miniaturas visibles a la vez: 4 en móvil y 5 desde sm. Si hay más, se vuelven un carrusel.
const VISIBLE_MOBILE = 4
const VISIBLE_DESKTOP = 5

const Thumbnails: React.FC<{
  photos: ProductPhoto[]
  activeUrl: string
  /** Color elegido: al cambiarlo, el carrusel vuelve a mostrar la miniatura activa */
  selected: string | null
  onPick: (url: string) => void
}> = ({ photos, activeUrl, selected, onPick }) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const list = listRef.current
    if (!list) return
    setAtStart(list.scrollLeft <= 1)
    setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 1)
  }

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [photos.length])

  // Si la miniatura activa queda fuera de vista (por ejemplo al elegir un color), el carrusel la trae
  useEffect(() => {
    const list = listRef.current
    const button = list?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!list || !button) return
    if (button.offsetLeft < list.scrollLeft) {
      list.scrollTo({ left: button.offsetLeft, behavior: 'smooth' })
    } else if (button.offsetLeft + button.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({
        left: button.offsetLeft + button.offsetWidth - list.clientWidth,
        behavior: 'smooth',
      })
    }
  }, [activeUrl, selected])

  const page = (direction: 1 | -1) => {
    const list = listRef.current
    if (!list) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollBy({ left: direction * list.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  // Las flechas solo existen cuando hay más miniaturas de las que caben
  const arrowVisibility = cn(
    photos.length > VISIBLE_MOBILE ? 'flex' : 'hidden',
    photos.length > VISIBLE_DESKTOP ? 'sm:flex' : 'sm:hidden',
  )
  const arrowClass = cn(
    'size-8 shrink-0 cursor-pointer items-center justify-center border border-input transition-colors duration-200 hover:bg-rosa-suave disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent sm:size-9',
    arrowVisibility,
  )

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        aria-label="Fotos anteriores"
        className={arrowClass}
        disabled={atStart}
        onClick={() => page(-1)}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>

      <ul
        aria-label="Fotos del producto"
        className="relative flex max-w-[248px] snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] sm:max-w-[352px] [&::-webkit-scrollbar]:hidden"
        onScroll={updateEdges}
        ref={listRef}
      >
        {photos.map((photo, i) => {
          const isActive = photo.url === activeUrl
          return (
            <li className="shrink-0 snap-start" key={photo.url}>
              <button
                aria-current={isActive}
                aria-label={`Ver foto ${i + 1}${photo.color ? `, color ${photo.color}` : ''}`}
                className={cn(
                  'relative block h-[70px] w-14 cursor-pointer overflow-hidden border-2 bg-crema transition-colors duration-200 focus-visible:outline-offset-[-2px] sm:h-20 sm:w-16',
                  isActive ? 'border-verde' : 'border-transparent hover:border-verde/40',
                )}
                onClick={() => onPick(photo.url)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  quality={IMAGE_QUALITY}
                  sizes="64px"
                  src={photo.url}
                />
              </button>
            </li>
          )
        })}
      </ul>

      <button
        aria-label="Fotos siguientes"
        className={arrowClass}
        disabled={atEnd}
        onClick={() => page(1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

/**
 * Foto principal grande con miniaturas debajo.
 * Al elegir un color, la foto principal pasa a ser la de ese color; al tocar una
 * miniatura, la foto principal cambia a esa foto.
 */
export const ColorGallery: React.FC<{ photos: ProductPhoto[] }> = ({ photos }) => {
  const { selected } = useColor()
  const [picked, setPicked] = useState<string | null>(null)

  // Elegir un color anula la miniatura tocada antes
  useEffect(() => {
    setPicked(null)
  }, [selected])

  const byColor = selected
    ? photos.find((photo) => photo.color && sameColor(photo.color, selected))
    : undefined
  const active = photos.find((photo) => photo.url === picked) ?? byColor ?? photos[0]

  if (!active) return null

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-crema">
        <Image
          alt={active.alt}
          className="object-cover"
          fill
          key={active.url}
          loading={active.url === photos[0]?.url ? 'eager' : undefined}
          priority={active.url === photos[0]?.url}
          quality={IMAGE_QUALITY}
          sizes="(min-width: 768px) 55vw, 100vw"
          src={active.url}
        />
      </div>

      {photos.length > 1 && (
        <Thumbnails activeUrl={active.url} onPick={setPicked} photos={photos} selected={selected} />
      )}
    </div>
  )
}

export const ColorPicker: React.FC<{ colors: string[] }> = ({ colors }) => {
  const { selected, toggle } = useColor()

  return (
    <div className="mt-8">
      <h2 aria-live="polite" className="mb-3 text-xs font-medium uppercase tracking-[0.18em]">
        {selected ? (
          <>
            Color: <span className="font-semibold">{selected}</span>
          </>
        ) : (
          'Colores disponibles'
        )}
      </h2>
      <ColorSwatches colors={colors} onSelect={toggle} selected={selected} variant="md" />
    </div>
  )
}
