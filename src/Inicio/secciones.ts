export const seccionesFijas = [
  { id: 'colecciones', label: 'Colecciones' },
  { id: 'novedades', label: 'Novedades' },
  { id: 'historia', label: 'Nuestra historia' },
  { id: 'instagram', label: 'Instagram' },
] as const

export type SeccionFijaId = (typeof seccionesFijas)[number]['id']

export const ordenPorDefecto: SeccionFijaId[] = seccionesFijas.map(({ id }) => id)
