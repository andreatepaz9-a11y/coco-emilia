'use client'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'

import { secciones } from './secciones'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{ seccion?: string }>()
  const nombre = secciones.find(({ id }) => id === data?.seccion)?.label ?? 'Sección'

  return <div>{`${(rowNumber ?? 0) + 1}. ${nombre}`}</div>
}
