import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

// La home muestra las categorías y cada una tiene su propia página de colección
export const revalidateCategory: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
    if (doc.slug) revalidatePath(`/coleccion/${doc.slug}`)
  }
  return doc
}

export const revalidateCategoryDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
    if (doc.slug) revalidatePath(`/coleccion/${doc.slug}`)
  }
  return doc
}
