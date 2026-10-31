import { validarEnlace } from '@/utilities/enlaceSeguro'
import { colorBotonField } from '@/utilities/estiloBoton'
import type { GlobalConfig } from 'payload'

import { instagramDefaults as d } from '../Inicio/defaults'
import { revalidateInstagram } from './hooks/revalidateInstagram'

export const Instagram: GlobalConfig = {
  slug: 'instagram',
  label: 'Instagram',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Sección "Síguenos en Instagram" del inicio: textos, botón y fotos. Si no agregas fotos, se muestran las de las colecciones.',
  },
  hooks: {
    afterChange: [revalidateInstagram],
  },
  fields: [
    {
      name: 'etiqueta',
      type: 'text',
      label: 'Texto pequeño sobre el título',
      defaultValue: d.etiqueta,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          label: 'Título',
          defaultValue: d.titulo,
          admin: { width: '50%' },
        },
        {
          name: 'tituloCursiva',
          type: 'text',
          label: 'Parte en cursiva del título',
          defaultValue: d.tituloCursiva,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'texto',
      type: 'text',
      label: 'Texto (después sale @tu_usuario)',
      defaultValue: d.texto,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'botonTexto',
          type: 'text',
          label: 'Texto del botón',
          defaultValue: d.botonTexto,
          admin: { width: '50%' },
        },
        {
          name: 'botonEnlace',
          validate: validarEnlace,
          type: 'text',
          label: 'Enlace del botón',
          defaultValue: d.botonEnlace,
          admin: { width: '50%', description: 'Si lo dejas vacío abre el perfil de Instagram de la tienda.' },
        },
      ],
    },
    colorBotonField('verde'),
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
