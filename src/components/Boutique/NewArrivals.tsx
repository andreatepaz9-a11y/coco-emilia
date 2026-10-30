import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { getInicio } from '@/utilities/getInicio'

import { ProductGrid } from './ProductGrid'

export const NewArrivals: React.FC = async () => {
  const { novedades } = await getInicio()
  if (!novedades.mostrar) return null

  const payload = await getPayload({ config: configPromise })

  const base = { collection: 'products', depth: 1, overrideAccess: false, pagination: false } as const

  let docs
  if (novedades.manual) {
    if (novedades.productos.length === 0) return null
    const encontrados = (
      await payload.find({ ...base, where: { id: { in: novedades.productos } } })
    ).docs
    docs = novedades.productos
      .map((id) => encontrados.find((p) => p.id === id))
      .filter((p) => !!p)
  } else {
    docs = (await payload.find({ ...base, limit: novedades.cantidad, sort: '-createdAt' })).docs
  }

  if (docs.length === 0) return null

  return (
    <section
      aria-labelledby="novedades-titulo"
      className="scroll-mt-20 border-t border-border py-16 md:py-28"
      id="novedades"
    >
      <div className="container">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">
            {novedades.etiqueta}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl" id="novedades-titulo">
            {novedades.titulo} <em className="italic">{novedades.tituloCursiva}</em>
          </h2>
        </div>

        <ProductGrid compact products={docs} />
      </div>
    </section>
  )
}
