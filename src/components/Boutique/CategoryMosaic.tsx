import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { categoryGroups } from '@/collections/categoryGroups'
import { categoryHref, getCategories } from '@/utilities/getCategories'
import { cn } from '@/utilities/ui'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const CategoryMosaic: React.FC = async () => {
  const docs = await getCategories()

  return (
    <section aria-labelledby="categorias-titulo" className="py-16 md:py-28" id="categorias">
      <div className="container">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">Explora</p>
          <h2 className="font-serif text-4xl md:text-5xl" id="categorias-titulo">
            Nuestras <em className="italic">colecciones</em>
          </h2>
        </div>

        <div className="space-y-16 md:space-y-24">
          {categoryGroups.map((group) => {
            const categories = docs.filter((category) => category.group === group.id)
            if (categories.length === 0) return null

            return (
              <div key={group.id}>
                {/* Título oculto a la vista: solo lo leen los lectores de pantalla */}
                <p className="sr-only" id={`grupo-${group.id}`}>
                  {group.label}
                </p>

                {/* Cada grupo centra su última fila; las tarjetas miden lo mismo en todos */}
                <ul
                  aria-labelledby={`grupo-${group.id}`}
                  className="flex flex-wrap justify-center gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14"
                >
                  {categories.map((category, i) => {
                    const photo = typeof category.image === 'object' ? category.image : null
                    const src = getMediaUrl(photo?.url, photo?.updatedAt)

                    return (
                      <li
                        className={cn(
                          'w-[calc((100%-1rem)/2)] md:w-[calc((100%-6rem)/4)]',
                          // Desde tablet, las columnas impares bajan para dar ritmo editorial
                          i % 2 === 1 && 'md:mt-16',
                        )}
                        key={category.id}
                      >
                        <Link className="group block" href={categoryHref(category)}>
                          <div
                            className={cn(
                              'relative aspect-[4/5] overflow-hidden',
                              // El color alterna dentro de cada grupo
                              i % 2 === 0 ? 'bg-rosa' : 'bg-crema',
                            )}
                          >
                            {photo?.url ? (
                              <Image
                                alt={photo.alt || `Colección de ${category.title}`}
                                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                fill
                                quality={IMAGE_QUALITY}
                                sizes="(min-width: 768px) 22vw, 50vw"
                                src={src}
                              />
                            ) : (
                              // Sin foto todavía: el nombre ocupa el recuadro
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 flex items-center justify-center p-6 text-center font-serif text-3xl italic"
                              >
                                {category.title}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-oliva pb-2.5 md:mt-4 md:gap-x-4 md:pb-3">
                            <h3 className="font-serif text-xl leading-tight md:text-3xl">
                              {category.title}
                            </h3>
                            <span
                              aria-hidden="true"
                              className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] transition-transform md:text-xs duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                            >
                              Ver →
                            </span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
