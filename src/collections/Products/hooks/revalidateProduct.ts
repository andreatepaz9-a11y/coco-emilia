import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

// Los productos salen en la home, en su colección y en la búsqueda: se refresca todo el sitio
export const revalidateProduct: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
  return doc
}
