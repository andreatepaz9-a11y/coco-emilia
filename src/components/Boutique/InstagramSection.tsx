import configPromise from '@payload-config'
import { Instagram as InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/utilities/instagram'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'

type Tile = { src: string; alt: string; href: string; position?: string }

// Respaldo mientras no se cargue ninguna foto en el panel (Instagram)
const fallbackTiles: Tile[] = [
  { src: '/brand/moda.jpg', alt: 'Moda de Coco Emilia' },
  { src: '/brand/joyeria.jpg', alt: 'Joyería de Coco Emilia' },
  { src: '/brand/pijamas.jpg', alt: 'Pijamas de Coco Emilia' },
  { src: '/brand/zapatos.jpg', alt: 'Zapatos de Coco Emilia' },
  { src: '/brand/carteras.jpg', alt: 'Bolsos de Coco Emilia' },
  { src: '/brand/cabello.jpg', alt: 'Accesorios para el cabello de Coco Emilia' },
].map((tile) => ({ ...tile, href: INSTAGRAM_URL }))

const getTiles = async (): Promise<Tile[]> => {
  const payload = await getPayload({ config: configPromise })
  const instagram = await payload.findGlobal({ slug: 'instagram', depth: 1 })

  const tiles = (instagram.photos ?? []).flatMap((item): Tile[] => {
    const media = item.image
    if (!media || typeof media !== 'object' || !media.url) return []
    return [
      {
        src: media.url,
        alt: media.alt || 'Publicación de Instagram de Coco Emilia',
        href: item.link?.trim() || INSTAGRAM_URL,
        // Punto de enfoque elegido en el panel (Archivos): decide qué parte se ve al recortar a cuadrado
        position:
          typeof media.focalX === 'number' && typeof media.focalY === 'number'
            ? `${media.focalX}% ${media.focalY}%`
            : undefined,
      },
    ]
  })

  return tiles.length > 0 ? tiles : fallbackTiles
}

export const InstagramSection: React.FC = async () => {
  const tiles = await getTiles()
  const count = tiles.length

  // Cuántas caben por fila: con pocas fotos se ven más grandes, hasta 3 en tablet y 6 en escritorio
  const style = {
    '--n3': Math.min(count, 3),
    '--n6': Math.min(count, 6),
  } as React.CSSProperties

  return (
    <section aria-labelledby="instagram-titulo" className="py-20 md:py-28">
      <div className="container">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">Instagram</p>
          <h2 className="font-serif text-4xl md:text-5xl" id="instagram-titulo">
            Síguenos en <em className="italic">Instagram</em>
          </h2>
          <p className="mt-4 text-base md:text-lg">
            Novedades, looks y lo que pasa detrás de cámaras en{' '}
            <a
              className="font-medium underline underline-offset-4 hover:no-underline"
              href={INSTAGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2 md:gap-3" style={style}>
          {tiles.map((tile) => (
            <li
              className="w-[calc((100%-0.5rem)/2)] md:w-[calc((100%-(var(--n3)-1)*0.75rem)/var(--n3))] md:max-w-[22rem] lg:w-[calc((100%-(var(--n6)-1)*0.75rem)/var(--n6))] lg:max-w-[22rem]"
              key={tile.src}
            >
              <a
                aria-label={`${tile.alt}, ver en Instagram (se abre en una pestaña nueva)`}
                className="group relative block aspect-square overflow-hidden bg-crema"
                href={tile.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image
                  alt=""
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  fill
                  quality={IMAGE_QUALITY}
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 33vw, 50vw"
                  src={tile.src}
                  style={tile.position ? { objectPosition: tile.position } : undefined}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-verde/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <InstagramIcon className="size-8 text-white" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            className="inline-flex h-12 items-center gap-2 bg-primary px-8 text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            href={INSTAGRAM_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <InstagramIcon aria-hidden="true" className="size-4" />
            Seguir en Instagram
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
