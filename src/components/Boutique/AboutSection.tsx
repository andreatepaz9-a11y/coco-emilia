import React from 'react'

import { whatsappUrl } from '@/utilities/whatsapp'

export const AboutSection: React.FC = () => {
  return (
    <section aria-labelledby="historia-titulo" className="bg-crema py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">Nuestra historia</p>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl" id="historia-titulo">
            Así nació <em className="italic">Coco Emilia</em>
          </h2>
          <div aria-hidden="true" className="mx-auto my-8 h-px w-16 bg-oliva" />
          <p className="text-base leading-relaxed md:text-lg">
            Coco Emilia nació del amor por la moda y por esos pequeños detalles que nos hacen sentir
            bonitas. Quisimos reunir en un solo lugar piezas elegidas con cariño: ropa, joyería,
            bolsos, zapatos, pijamas y accesorios para el cabello.
          </p>
          <a
            className="mt-10 inline-flex h-12 items-center border border-primary px-8 text-xs font-medium uppercase tracking-[0.12em] text-primary transition-colors duration-200 hover:bg-rosa"
            href={whatsappUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            Escríbenos
            <span className="sr-only"> por WhatsApp (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
