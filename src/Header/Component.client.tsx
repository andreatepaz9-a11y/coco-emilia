'use client'
import { Instagram, Menu, SearchIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/utilities/instagram'
import { Logo } from '@/components/Logo/Logo'
import { whatsappUrl } from '@/utilities/whatsapp'

// Rosa de marca (#FADBDA) tal como lo devuelve getComputedStyle
const ROSA_RGB = [250, 219, 218]

const isRosa = (color: string) => {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return false
  return ROSA_RGB.every((value, i) => Math.abs(value - Number(match[i + 1])) <= 3)
}

type NavCategory = { href: string; id: number; title: string }

const navLinkClass =
  'relative py-2 text-xs font-medium uppercase tracking-[0.14em] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-verde after:transition-transform after:duration-300 hover:after:scale-x-100 motion-reduce:after:transition-none'

const iconButtonClass =
  'flex size-11 items-center justify-center transition-colors duration-200 hover:bg-rosa'

export const HeaderClient: React.FC<{
  categories: NavCategory[]
  paginas: { href: string; id: number; title: string }[]
}> = ({ categories, paginas }) => {
  // Mitad de las colecciones a la izquierda del logo y el resto a la derecha
  const half = Math.ceil(categories.length / 2)
  const leftLinks = categories.slice(0, half)
  const rightLinks = categories.slice(half)
  const [menuOpen, setMenuOpen] = useState(false)
  // 'blanco' cuando detrás hay una sección rosa; 'rosa' en cualquier otro caso
  const [tone, setTone] = useState<'blanco' | 'rosa'>('blanco')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    let frame = 0

    const detect = () => {
      frame = 0
      const header = headerRef.current
      if (!header) return
      const y = header.getBoundingClientRect().bottom + 2
      const below = document
        .elementsFromPoint(window.innerWidth / 2, y)
        .find((element) => !header.contains(element))
      const section = below?.closest('section, footer')
      const background = section ? getComputedStyle(section).backgroundColor : ''
      setTone(isRosa(background) ? 'blanco' : 'rosa')
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(detect)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      <div className="bg-verde text-white">
        <p className="container py-2 text-center text-[0.6875rem] font-medium uppercase tracking-[0.18em]">
          Síguenos en Instagram{' '}
          <a
            className="underline underline-offset-4 hover:no-underline"
            href={INSTAGRAM_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            @{INSTAGRAM_HANDLE}
          </a>
        </p>
      </div>

      <header
        className={`sticky top-0 z-30 border-b border-border transition-colors duration-300 motion-reduce:transition-none ${
          tone === 'blanco' ? 'bg-background' : 'bg-rosa-suave'
        }`}
        ref={headerRef}
      >
        <div className="container relative grid grid-cols-[1fr_auto_1fr] items-center py-2">
          {/* Izquierda: menú en móvil, categorías en escritorio */}
          <div className="flex items-center">
            <button
              aria-controls="menu-movil"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className={`${iconButtonClass} -ml-3 cursor-pointer lg:hidden`}
              onClick={() => setMenuOpen((open) => !open)}
              ref={menuButtonRef}
              type="button"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-6" />
              ) : (
                <Menu aria-hidden="true" className="size-6" />
              )}
            </button>
            <nav aria-label="Colecciones" className="hidden gap-6 lg:flex xl:gap-8">
              {leftLinks.map((category) => (
                <Link className={navLinkClass} href={category.href} key={category.id}>
                  {category.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centro: logo */}
          <Link aria-label="Coco Emilia, ir al inicio" href="/">
            <Logo loading="eager" priority="high" />
          </Link>

          {/* Derecha: categorías, buscar e Instagram */}
          <div className="flex items-center justify-end">
            <nav aria-label="Más colecciones" className="mr-4 hidden gap-6 lg:flex xl:gap-8">
              {rightLinks.map((category) => (
                <Link className={navLinkClass} href={category.href} key={category.id}>
                  {category.title}
                </Link>
              ))}
            </nav>
            <a
              aria-label={`Instagram @${INSTAGRAM_HANDLE} (se abre en una pestaña nueva)`}
              className={`${iconButtonClass} hidden sm:flex`}
              href={INSTAGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Instagram aria-hidden="true" className="size-5" />
            </a>
            <Link aria-label="Buscar" className={`${iconButtonClass} -mr-3`} href="/search">
              <SearchIcon aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <nav
            aria-label="Menú principal"
            className="absolute inset-x-0 top-full border-b border-border bg-background shadow-sm lg:hidden"
            id="menu-movil"
          >
            <ul className="container py-6">
              {categories.map((category) => (
                <li className="border-b border-border last:border-b-0" key={category.id}>
                  <Link
                    className="flex min-h-14 items-center justify-between font-serif text-2xl"
                    href={category.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {category.title}
                    <span aria-hidden="true" className="text-sm">
                      →
                    </span>
                  </Link>
                </li>
              ))}
              {paginas.map((pagina) => (
                <li className="border-b border-border" key={pagina.id}>
                  <Link
                    className="flex min-h-12 items-center text-xs font-medium uppercase tracking-[0.14em]"
                    href={pagina.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {pagina.title}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <a
                  className="flex min-h-12 items-center text-xs font-medium uppercase tracking-[0.14em]"
                  href={whatsappUrl()}
                  onClick={() => setMenuOpen(false)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Contacto
                  <span className="sr-only"> por WhatsApp (se abre en una pestaña nueva)</span>
                </a>
              </li>
              <li>
                <a
                  className="flex min-h-12 items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]"
                  href={INSTAGRAM_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Instagram aria-hidden="true" className="size-4" />
                  Instagram
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}
