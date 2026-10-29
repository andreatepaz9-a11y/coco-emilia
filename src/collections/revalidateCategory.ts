import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

// Las categorías salen en el menú, el pie de página, la home y la búsqueda: se refresca todo el sitio
export const revalidateCategory: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
    if (doc.slug) revalidatePath(`/coleccion/${doc.slug}`)
  }
  return doc
}

export const revalidateCategoryDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
    if (doc.slug) revalidatePath(`/coleccion/${doc.slug}`)
  }
  return doc
}
