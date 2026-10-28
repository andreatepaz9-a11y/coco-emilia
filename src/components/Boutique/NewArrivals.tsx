import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ProductGrid } from './ProductGrid'

export const NewArrivals: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 3,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
  })

  if (docs.length === 0) return null

  return (
    <section aria-labelledby="novedades-titulo" className="border-t border-border py-16 md:py-28">
      <div className="container">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">Lo último</p>
          <h2 className="font-serif text-4xl md:text-5xl" id="novedades-titulo">
            <em className="italic">Novedades</em>
          </h2>
        </div>

        <ProductGrid compact products={docs} />
      </div>
    </section>
  )
}
