import { Instagram } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/utilities/instagram'
import { categoryHref, getCategories } from '@/utilities/getCategories'
import { Logo } from '@/components/Logo/Logo'
import { whatsappUrl } from '@/utilities/whatsapp'

const headingClass = 'mb-5 text-xs font-medium uppercase tracking-[0.18em] text-verde'
const linkClass = 'inline-flex min-h-8 items-center text-sm underline-offset-4 hover:underline'

export async function Footer() {
  const categories = await getCategories()

  return (
    <footer className="mt-auto bg-rosa text-verde">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
        <div>
          <Link aria-label="Coco Emilia, ir al inicio" className="inline-block" href="/">
            <Logo className="h-20" />
          </Link>
          <p className="mt-5 font-serif text-lg italic leading-snug">Tu estilo, con mucho cariño</p>
          <p className="mt-2 max-w-[16rem] text-sm leading-relaxed">
            Piezas escogidas con amor para chicas que aman verse y sentirse bonitas.
          </p>
        </div>

        <nav aria-label="Colecciones en el pie de página">
          <h2 className={headingClass}>Colecciones</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link className={linkClass} href={categoryHref(category)}>
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ayuda">
          <h2 className={headingClass}>Ayuda</h2>
          <ul>
            <li>
              <a
                className={linkClass}
                href={whatsappUrl()}
                rel="noopener noreferrer"
                target="_blank"
              >
                Contacto
                <span className="sr-only"> por WhatsApp (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li>
              <Link className={linkClass} href="/search">
                Buscar
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Síguenos</h2>
          <a
            className={`${linkClass} gap-2`}
            href={INSTAGRAM_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Instagram aria-hidden="true" className="size-4" />@{INSTAGRAM_HANDLE}
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>

      <div className="border-t border-verde/20">
        <p className="container py-6 text-center text-xs tracking-wide">
          © {new Date().getFullYear()} Coco Emilia. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
