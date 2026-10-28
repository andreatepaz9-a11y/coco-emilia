import type { GlobalConfig } from 'payload'

import { revalidateInstagram } from './hooks/revalidateInstagram'

export const Instagram: GlobalConfig = {
  slug: 'instagram',
  label: 'Instagram',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Fotos de la sección "Síguenos en Instagram" del inicio. Si no agregas ninguna, se muestran las fotos de las colecciones.',
  },
  hooks: {
    afterChange: [revalidateInstagram],
  },
  fields: [
    {
      name: 'photos',
      type: 'array',
      label: 'Fotos',
      maxRows: 6,
      labels: { singular: 'Foto', plural: 'Fotos' },
      admin: {
        description: 'Hasta 6 fotos. Se muestran en este orden. Con 3 o menos se ven más grandes.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Foto',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Enlace de la publicación (opcional)',
          admin: {
            description:
              'Si lo llenas, la foto abre esa publicación. Si no, abre tu perfil de Instagram.',
          },
        },
      ],
    },
  ],
}
