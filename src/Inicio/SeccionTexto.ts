import type { Block } from 'payload'

import { validarEnlace } from '@/utilities/enlaceSeguro'
import { colorBotonField } from '@/utilities/estiloBoton'

import { seccionTextoDefaults as d } from './defaults'

export const SeccionTexto: Block = {
  slug: 'seccionTexto',
  labels: { singular: 'Texto con foto', plural: 'Textos con foto' },
  fields: [
    { name: 'etiqueta', type: 'text', label: 'Texto pequeño sobre el título', defaultValue: d.etiqueta },
    {
      type: 'row',
      fields: [
        { name: 'titulo', type: 'text', label: 'Título', defaultValue: d.titulo, admin: { width: '50%' } },
        {
          name: 'tituloCursiva',
          type: 'text',
          label: 'Parte en cursiva del título',
          defaultValue: d.tituloCursiva,
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'texto', type: 'textarea', label: 'Texto', defaultValue: d.texto },
    {
      type: 'row',
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', label: 'Foto (opcional)', admin: { width: '50%' } },
        {
          name: 'posicionFoto',
          type: 'select',
          label: 'Dónde va la foto',
          defaultValue: 'derecha',
          options: [
            { label: 'A la derecha', value: 'derecha' },
            { label: 'A la izquierda', value: 'izquierda' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'fondo',
      type: 'select',
      label: 'Color de fondo',
      defaultValue: 'rosa',
      options: [
        { label: 'Rosa', value: 'rosa' },
        { label: 'Crema', value: 'crema' },
        { label: 'Blanco', value: 'blanco' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'botonTexto',
          type: 'text',
          label: 'Texto del botón',
          defaultValue: d.botonTexto,
          admin: { width: '50%', description: 'Déjalo vacío para no mostrar botón.' },
        },
        {
          name: 'botonEnlace',
          validate: validarEnlace,
          type: 'text',
          label: 'Enlace del botón',
          defaultValue: d.botonEnlace,
          admin: { width: '50%' },
        },
      ],
    },
    colorBotonField('verde'),
  ],
}
