import type { Field, GlobalConfig } from 'payload'

import { colorBotonField } from '@/utilities/estiloBoton'

import { inicioDefaults as d } from './defaults'
import { revalidateInicio } from './hooks/revalidateInicio'
import { ordenPorDefecto, secciones } from './secciones'

const titulo = (defaults: { titulo: string; tituloCursiva: string }): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'titulo',
        type: 'text',
        label: 'Título',
        defaultValue: defaults.titulo,
        admin: { width: '50%' },
      },
      {
        name: 'tituloCursiva',
        type: 'text',
        label: 'Parte en cursiva del título',
        defaultValue: defaults.tituloCursiva,
        admin: { width: '50%', description: 'Se escribe después del título, en letra cursiva.' },
      },
    ],
  },
]

const etiqueta = (defaultValue: string): Field => ({
  name: 'etiqueta',
  type: 'text',
  label: 'Texto pequeño sobre el título',
  defaultValue,
})

export const Inicio: GlobalConfig = {
  slug: 'inicio',
  label: 'Inicio',
  access: { read: () => true },
  admin: {
    description:
      'Textos de la página de inicio. La portada (foto, texto y botón) se edita en Páginas → Home, las tarjetas en Categorías y la sección de Instagram en Instagram.',
  },
  hooks: { afterChange: [revalidateInicio] },
  fields: [
    {
      name: 'orden',
      type: 'array',
      label: 'Orden de las secciones',
      labels: { singular: 'Sección', plural: 'Secciones' },
      minRows: 1,
      maxRows: secciones.length,
      defaultValue: ordenPorDefecto.map((seccion) => ({ seccion })),
      admin: {
        description:
          'Arrastra para cambiar el orden en que se ven en el inicio (la portada siempre va primero). Si quitas una, no se muestra; para volver a ponerla usa "Añadir Sección".',
        components: { RowLabel: '@/Inicio/RowLabel#RowLabel' },
      },
      fields: [
        {
          name: 'seccion',
          type: 'select',
          label: 'Sección',
          required: true,
          options: secciones.map(({ id, label }) => ({ label, value: id })),
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'colecciones',
          label: 'Colecciones',
          fields: [etiqueta(d.colecciones.etiqueta), ...titulo(d.colecciones)],
        },
        {
          name: 'novedades',
          label: 'Novedades',
          fields: [
            {
              name: 'mostrar',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.novedades.mostrar,
            },
            etiqueta(d.novedades.etiqueta),
            ...titulo(d.novedades),
            {
              name: 'modo',
              type: 'radio',
              label: 'Qué productos mostrar',
              defaultValue: 'ultimos',
              options: [
                { label: 'Los últimos que suba', value: 'ultimos' },
                { label: 'Elegirlos yo', value: 'manual' },
              ],
            },
            {
              name: 'cantidad',
              type: 'number',
              label: 'Cuántos productos mostrar',
              defaultValue: d.novedades.cantidad,
              min: 1,
              max: 12,
              admin: {
                description: 'Se muestran los últimos productos que subas.',
                condition: (_, siblingData) => siblingData?.modo !== 'manual',
              },
            },
            {
              name: 'productos',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 12,
              label: 'Productos elegidos',
              admin: {
                description: 'Salen en el mismo orden en que los pongas (arrastra para cambiarlo).',
                condition: (_, siblingData) => siblingData?.modo === 'manual',
              },
            },
          ],
        },
        {
          name: 'historia',
          label: 'Nuestra historia',
          fields: [
            {
              name: 'mostrar',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.historia.mostrar,
            },
            etiqueta(d.historia.etiqueta),
            ...titulo(d.historia),
            {
              name: 'texto',
              type: 'textarea',
              label: 'Texto',
              defaultValue: d.historia.texto,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'botonTexto',
                  type: 'text',
                  label: 'Texto del botón',
                  defaultValue: d.historia.botonTexto,
                  admin: { width: '50%' },
                },
                {
                  name: 'botonEnlace',
                  type: 'text',
                  label: 'Enlace del botón',
                  defaultValue: d.historia.botonEnlace,
                  admin: {
                    width: '50%',
                    description: 'Si lo dejas vacío abre el WhatsApp de la tienda.',
                  },
                },
              ],
            },
            colorBotonField('borde'),
          ],
        },
      ],
    },
  ],
}
