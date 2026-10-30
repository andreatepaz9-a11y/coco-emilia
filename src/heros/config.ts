import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { colorBotonField } from '@/utilities/estiloBoton'

// Los campos de la portada de la tienda solo aplican a la página con slug "home"
const soloHome = (data: { slug?: string } | undefined) => data?.slug === 'home'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Tipo de portada',
      admin: {
        condition: (data: { slug?: string } | undefined) => data?.slug !== 'home',
        description: 'Define el diseño de la portada de esta página.',
      },
      options: [
        {
          label: 'Ninguna',
          value: 'none',
        },
        {
          label: 'Grande, con foto',
          value: 'highImpact',
        },
        {
          label: 'Mediana, con foto',
          value: 'mediumImpact',
        },
        {
          label: 'Solo título y texto',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'etiqueta',
      type: 'text',
      label: 'Texto pequeño sobre el título',
      defaultValue: 'Coco Emilia',
      admin: { condition: soloHome },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          label: 'Título',
          defaultValue: 'Tu estilo,',
          admin: { width: '50%', condition: soloHome },
        },
        {
          name: 'tituloCursiva',
          type: 'text',
          label: 'Parte en cursiva del título',
          defaultValue: 'con mucho cariño',
          admin: {
            width: '50%',
            condition: soloHome,
            description: 'Sale después del título, en letra cursiva.',
          },
        },
      ],
    },
    {
      name: 'texto',
      type: 'textarea',
      label: 'Texto',
      defaultValue:
        'Moda, ropa deportiva, joyería, bolsos, zapatos, pijamas y todo para tu cabello. Piezas que te hacen sentir tú.',
      admin: { condition: soloHome },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: { condition: (data: { slug?: string } | undefined) => data?.slug !== 'home' },
    },
    linkGroup({
      overrides: {
        label: 'Botón',
        labels: { singular: 'Botón', plural: 'Botón' },
        maxRows: 1,
        admin: {
          initCollapsed: false,
          description:
            'Pulsa "Añadir Botón" y escribe el nombre en Label y a dónde lleva en Internal link o Custom URL. El estilo del botón no se cambia desde aquí.',
        },
      },
    }),
    colorBotonField('verde', soloHome),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (data, { type } = {}) =>
          data?.slug === 'home' || ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
