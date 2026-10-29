import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { sameColor } from '../../utilities/colorSwatches'
import { authenticated } from '../../access/authenticated'
import { revalidateProduct, revalidateProductDelete } from './hooks/revalidateProduct'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'updatedAt'],
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [revalidateProductDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nombre',
      required: true,
      admin: { description: 'Ej.: Blusa asimétrica' },
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Categoría',
      relationTo: 'categories',
      required: true,
      index: true,
      admin: { description: 'Las categorías se crean y ordenan en la sección Categorías.' },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Descripción corta',
      maxLength: 100,
      admin: { description: 'Una sola línea. Ej.: Anillo con diamante' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Precio',
          required: true,
          min: 0,
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          label: 'Precio anterior (opcional)',
          min: 0,
          admin: { description: 'Si lo llenas, se muestra tachado junto al precio.' },
        },
      ],
    },
    {
      name: 'colors',
      type: 'text',
      label: 'Colores',
      hasMany: true,
      admin: {
        description:
          'Escribe un color y presiona Enter. Usa nombres comunes (rosa, amarillo, café, negro, vino…) para que se vea el circulito de color.',
      },
    },
    {
      name: 'sizes',
      type: 'text',
      label: 'Tallas',
      hasMany: true,
      admin: {
        description: 'Escribe una talla y presiona Enter. Ej.: 5, 6, 7 o S, M, L',
      },
    },
    {
      name: 'badge',
      type: 'select',
      label: 'Etiqueta',
      options: [
        { label: 'Nuevo', value: 'Nuevo' },
        { label: 'Oferta', value: 'Oferta' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Fotos',
      minRows: 1,
      maxRows: 12,
      admin: {
        description:
          'La primera es la principal. Marca el color de cada foto para que cambie al elegir ese color; si no lo marcas y tienes tantas fotos como colores, se asume que van en el mismo orden que los colores.',
      },
      labels: { singular: 'Foto', plural: 'Fotos' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'image',
              type: 'upload',
              label: 'Foto',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'color',
              type: 'text',
              label: 'Color que muestra (opcional)',
              admin: {
                description:
                  'Escribe el mismo nombre que en Colores (ej.: rosa). Al elegir ese color en la tienda, se mostrará esta foto.',
              },
              validate: (value: string | null | undefined, { data }: { data: unknown }) => {
                if (!value) return true
                const colors = (data as { colors?: string[] } | undefined)?.colors ?? []
                return colors.some((color) => sameColor(color, value))
                  ? true
                  : 'Debe ser uno de los colores que escribiste arriba, en Colores.'
              },
            },
          ],
        },
      ],
    },
    slugField({
      position: undefined,
    }),
  ],
}
