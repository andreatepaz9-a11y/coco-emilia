import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { inicioDefaults } from '@/Inicio/defaults'
import { ordenPorDefecto, secciones, type SeccionId } from '@/Inicio/secciones'

const text = (value: string | null | undefined, fallback: string) =>
  typeof value === 'string' ? value : fallback

export const getInicio = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const doc = await payload.findGlobal({ slug: 'inicio', depth: 1 })
  const d = inicioDefaults

  const validas = new Set<string>(secciones.map(({ id }) => id))
  const orden = (doc.orden ?? [])
    .map(({ seccion }) => seccion)
    .filter((id): id is SeccionId => !!id && validas.has(id))

  return {
    orden: orden.length > 0 ? Array.from(new Set(orden)) : ordenPorDefecto,
    colecciones: {
      etiqueta: text(doc.colecciones?.etiqueta, d.colecciones.etiqueta),
      titulo: text(doc.colecciones?.titulo, d.colecciones.titulo),
      tituloCursiva: text(doc.colecciones?.tituloCursiva, d.colecciones.tituloCursiva),
    },
    novedades: {
      mostrar: doc.novedades?.mostrar ?? d.novedades.mostrar,
      etiqueta: text(doc.novedades?.etiqueta, d.novedades.etiqueta),
      titulo: text(doc.novedades?.titulo, d.novedades.titulo),
      tituloCursiva: text(doc.novedades?.tituloCursiva, d.novedades.tituloCursiva),
      cantidad: doc.novedades?.cantidad ?? d.novedades.cantidad,
      manual: doc.novedades?.modo === 'manual',
      productos: (doc.novedades?.productos ?? []).map((p) => (typeof p === 'object' ? p.id : p)),
    },
    historia: {
      mostrar: doc.historia?.mostrar ?? d.historia.mostrar,
      etiqueta: text(doc.historia?.etiqueta, d.historia.etiqueta),
      titulo: text(doc.historia?.titulo, d.historia.titulo),
      tituloCursiva: text(doc.historia?.tituloCursiva, d.historia.tituloCursiva),
      texto: text(doc.historia?.texto, d.historia.texto),
      botonTexto: text(doc.historia?.botonTexto, d.historia.botonTexto),
      botonEnlace: doc.historia?.botonEnlace?.trim() || '',
      colorBoton: doc.historia?.colorBoton,
    },
  }
})
