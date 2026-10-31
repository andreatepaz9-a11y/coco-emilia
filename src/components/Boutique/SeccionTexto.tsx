import Image from 'next/image'
import React from 'react'

import type { Inicio } from '@/payload-types'
import { seccionTextoDefaults as d } from '@/Inicio/defaults'
import { estiloBoton } from '@/utilities/estiloBoton'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'

type Datos = Extract<NonNullable<Inicio['secciones']>[number], { blockType: 'seccionTexto' }>

const fondos = { rosa: 'bg-rosa', crema: 'bg-crema', blanco: 'bg-background' } as const

const text = (value: string | null | undefined, fallback: string) =>
  typeof value === 'string' ? value : fallback

export const SeccionTexto: React.FC<{ datos: Datos }> = ({ datos }) => {
  const foto = datos.imagen && typeof datos.imagen === 'object' ? datos.imagen : null
  const botonTexto = text(datos.botonTexto, d.botonTexto)
  const botonEnlace = text(datos.botonEnlace, d.botonEnlace)
  const externo = /^https?:\/\//.test(botonEnlace)
  const etiqueta = text(datos.etiqueta, d.etiqueta)
  const texto = text(datos.texto, d.texto)
  const fondo = fondos[datos.fondo ?? 'rosa'] ?? fondos.rosa
  const izquierda = datos.posicionFoto === 'izquierda'
  const id = `seccion-${datos.id}`

  return (
    <section aria-labelledby={`${id}-titulo`} className={`scroll-mt-20 py-16 md:py-24 ${fondo}`} id={id}>
      <div
        className={`container grid items-center gap-10 ${foto?.url ? 'md:grid-cols-2 md:gap-16' : 'max-w-2xl text-center'}`}
      >
        <div className={izquierda ? 'md:order-2' : undefined}>
          {etiqueta && (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">{etiqueta}</p>
          )}
          <h2 className="font-serif text-4xl leading-tight md:text-5xl" id={`${id}-titulo`}>
            {text(datos.titulo, d.titulo)} <em className="italic">{text(datos.tituloCursiva, d.tituloCursiva)}</em>
          </h2>
          {texto && <p className="mt-6 text-base leading-relaxed md:text-lg">{texto}</p>}
          {botonTexto && (
            <a
              className={`mt-8 ${estiloBoton(datos.colorBoton, 'verde')}`}
              href={botonEnlace || '#'}
              rel={externo ? 'noopener noreferrer' : undefined}
              target={externo ? '_blank' : undefined}
            >
              {botonTexto}
              {externo && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
            </a>
          )}
        </div>
        {foto?.url && (
          <div className={`relative aspect-[4/3] w-full overflow-hidden ${izquierda ? 'md:order-1' : ''}`}>
            <Image
              alt={foto.alt || ''}
              className="object-cover"
              fill
              quality={IMAGE_QUALITY}
              sizes="(min-width: 768px) 45vw, 100vw"
              src={getMediaUrl(foto.url, foto.updatedAt)}
            />
          </div>
        )}
      </div>
    </section>
  )
}
