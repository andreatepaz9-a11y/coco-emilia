import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

// La página de inicio muestra los productos más recientes
export const revalidateProduct: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
  }
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
  }
  return doc
}
