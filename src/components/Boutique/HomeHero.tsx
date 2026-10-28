import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'

export const HomeHero: React.FC = () => {
  return (
    <section className="bg-rosa">
      <div className="container grid items-center gap-10 py-12 md:grid-cols-2 md:gap-10 lg:gap-14 xl:grid-cols-[1fr_36rem] md:py-20">
        <div className="order-2 md:order-1">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em]">Coco Emilia</p>
          <h1 className="font-serif text-5xl leading-[1.05] md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            Tu estilo, <em className="italic">con mucho cariño</em>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed md:text-lg">
            Moda, ropa deportiva, joyería, bolsos, zapatos, pijamas y todo para tu cabello. Piezas
            que te hacen sentir tú.
          </p>
          <Link
            className="mt-10 inline-flex h-12 items-center bg-primary px-8 text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            href="#categorias"
          >
            Descubrir colecciones
          </Link>
        </div>
        <div className="order-1 md:order-2">
          {/* Marco en arco: la parte superior es un semicírculo */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full md:max-w-none">
            <Image
              alt="Coco Emilia: moda y estilo"
              className="object-cover object-top"
              fill
              priority
              quality={IMAGE_QUALITY}
              sizes="(min-width: 768px) 55vw, 100vw"
              src="/brand/hero.png"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
