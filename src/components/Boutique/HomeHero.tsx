import Image from 'next/image'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { inicioDefaults } from '@/Inicio/defaults'
import type { Page } from '@/payload-types'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'
import { estiloBoton } from '@/utilities/estiloBoton'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const FOTO_POR_DEFECTO = '/brand/hero-2.jpg'

export const HomeHero: React.FC<{ hero?: Page['hero'] | null }> = ({ hero }) => {
  const d = inicioDefaults.portada
  const foto = hero?.media && typeof hero.media === 'object' ? hero.media : null
  const src = foto?.url ? getMediaUrl(foto.url, foto.updatedAt) : FOTO_POR_DEFECTO
  const posicion =
    foto && typeof foto.focalX === 'number' && typeof foto.focalY === 'number'
      ? `${foto.focalX}% ${foto.focalY}%`
      : undefined
  const etiqueta = typeof hero?.etiqueta === 'string' ? hero.etiqueta : d.etiqueta
  const titulo = typeof hero?.titulo === 'string' ? hero.titulo : d.titulo
  const tituloCursiva = typeof hero?.tituloCursiva === 'string' ? hero.tituloCursiva : d.tituloCursiva
  const texto = typeof hero?.texto === 'string' ? hero.texto : d.texto
  const boton = hero?.links?.[0]?.link

  return (
    <section className="bg-rosa">
      <div className="container grid items-center gap-10 py-12 md:grid-cols-2 md:gap-10 lg:gap-14 xl:grid-cols-[1fr_36rem] md:py-20">
        <div className="order-2 md:order-1">
          {etiqueta && (
            <p className="entrada mb-6 text-xs font-medium uppercase tracking-[0.2em]">{etiqueta}</p>
          )}
          <h1 style={{ '--retraso': '0.1s' } as React.CSSProperties} className="entrada font-serif text-5xl leading-[1.05] md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {titulo} <em className="italic">{tituloCursiva}</em>
          </h1>
          {texto && <p style={{ '--retraso': '0.25s' } as React.CSSProperties} className="entrada mt-6 max-w-lg text-base leading-relaxed md:text-lg">{texto}</p>}
          {boton && (
            <CMSLink
              {...boton}
              appearance="inline"
              className={`entrada [animation-delay:0.4s] mt-10 ${estiloBoton(hero?.colorBoton, 'verde')}`}
            />
          )}
        </div>
        <div className="entrada order-1 md:order-2" style={{ '--retraso': '0.15s' } as React.CSSProperties}>
          {/* Marco en arco: la parte superior es un semicírculo */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full md:max-w-none">
            <Image
              alt={foto?.alt || d.imagenAlt}
              className={posicion ? 'object-cover' : 'object-cover object-top'}
              fill
              priority
              quality={IMAGE_QUALITY}
              sizes="(min-width: 768px) 55vw, 100vw"
              src={src}
              style={posicion ? { objectPosition: posicion } : undefined}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
