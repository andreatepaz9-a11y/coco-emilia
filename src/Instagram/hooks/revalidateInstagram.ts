import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

// Las fotos de Instagram se muestran en la página de inicio
export const revalidateInstagram: GlobalAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
  }
  return doc
}
