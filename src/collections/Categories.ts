import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'group', 'order', 'slug'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Imagen',
      relationTo: 'media',
      admin: { description: 'Sin imagen, la tarjeta muestra un bloque de color con el nombre.' },
    },
    {
      name: 'group',
      type: 'select',
      label: 'Grupo',
      defaultValue: 'ropa',
      index: true,
      options: [
        { label: 'Ropa y calzado', value: 'ropa' },
        { label: 'Accesorios', value: 'accesorios' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden',
      defaultValue: 0,
      index: true,
      admin: { description: 'Más bajo aparece primero dentro de su grupo.' },
    },
    slugField({
      position: undefined,
    }),
  ],
}
