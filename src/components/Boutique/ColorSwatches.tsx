'use client'
import React from 'react'

import { cn } from '@/utilities/ui'
import { getSwatchBackground, sameColor } from '@/utilities/colorSwatches'

type Props = {
  colors: string[]
  /** 'sm' para las tarjetas, 'md' con el nombre al lado para la página del producto */
  variant?: 'sm' | 'md'
  /** Color seleccionado (si se pasa onSelect, los circulitos se vuelven seleccionables) */
  selected?: string | null
  onSelect?: (color: string) => void
  className?: string
}

const Dot: React.FC<{ name: string; large?: boolean; selected?: boolean }> = ({
  name,
  large,
  selected,
}) => {
  const background = getSwatchBackground(name)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block shrink-0 rounded-full border',
        large ? 'size-5' : 'size-4',
        // Los colores muy claros (blanco, crema) necesitan borde visible; si no se reconoce, punteado
        background ? 'border-verde/40' : 'border-dashed border-verde/60',
        // El anillo marca el color elegido sin depender solo del color
        selected && 'ring-2 ring-verde ring-offset-2',
      )}
      style={background ? { background } : undefined}
    />
  )
}

export const ColorSwatches: React.FC<Props> = ({
  colors,
  variant = 'sm',
  selected,
  onSelect,
  className,
}) => {
  if (colors.length === 0) return null

  const isSelected = (color: string) => Boolean(selected && sameColor(selected, color))

  return (
    <ul
      aria-label="Colores disponibles"
      className={cn('flex flex-wrap', variant === 'sm' ? 'gap-1 pt-1' : 'gap-2', className)}
    >
      {colors.map((color) => {
        const active = isSelected(color)

        if (variant === 'sm') {
          return (
            <li key={color}>
              {onSelect ? (
                <button
                  aria-label={color}
                  aria-pressed={active}
                  className="relative z-10 flex size-6 cursor-pointer items-center justify-center"
                  onClick={() => onSelect(color)}
                  title={color}
                  type="button"
                >
                  <Dot name={color} selected={active} />
                </button>
              ) : (
                <span className="flex size-6 items-center justify-center" title={color}>
                  <Dot name={color} />
                  <span className="sr-only">{color}</span>
                </span>
              )}
            </li>
          )
        }

        const content = (
          <>
            <Dot large name={color} selected={active} />
            {color}
          </>
        )

        return (
          <li key={color}>
            {onSelect ? (
              <button
                aria-pressed={active}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center gap-3 border px-4 py-2 text-sm transition-colors duration-200',
                  active ? 'border-verde bg-rosa-suave' : 'border-input hover:bg-rosa-suave',
                )}
                onClick={() => onSelect(color)}
                type="button"
              >
                {content}
              </button>
            ) : (
              <span className="flex items-center gap-2 border border-input px-3 py-2 text-sm">
                {content}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
