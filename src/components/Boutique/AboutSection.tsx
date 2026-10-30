import React from 'react'

import { estiloBoton } from '@/utilities/estiloBoton'
import { getInicio } from '@/utilities/getInicio'
import { whatsappUrl } from '@/utilities/whatsapp'

export const AboutSection: React.FC = async () => {
  const { historia } = await getInicio()
  if (!historia.mostrar) return null

  const href = historia.botonEnlace || whatsappUrl()
  const externo = /^https?:\/\//.test(href)

  return (
    <section
      aria-labelledby="historia-titulo"
      className="scroll-mt-20 bg-crema py-20 md:py-32"
      id="historia"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">
            {historia.etiqueta}
          </p>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl" id="historia-titulo">
            {historia.titulo} <em className="italic">{historia.tituloCursiva}</em>
          </h2>
          <div aria-hidden="true" className="mx-auto my-8 h-px w-16 bg-oliva" />
          <p className="text-base leading-relaxed md:text-lg">
            {historia.texto}
          </p>
          <a
            className={`mt-10 ${estiloBoton(historia.colorBoton, 'borde')}`}
            href={href}
            rel={externo ? 'noopener noreferrer' : undefined}
            target={externo ? '_blank' : undefined}
          >
            {historia.botonTexto}
            {externo && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
          </a>
        </div>
      </div>
    </section>
  )
}
