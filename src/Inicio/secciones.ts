export const secciones = [
  { id: 'colecciones', label: 'Colecciones' },
  { id: 'novedades', label: 'Novedades' },
  { id: 'historia', label: 'Nuestra historia' },
  { id: 'instagram', label: 'Instagram' },
] as const

export type SeccionId = (typeof secciones)[number]['id']

export const ordenPorDefecto: SeccionId[] = secciones.map(({ id }) => id)
