import type { Field } from 'payload'

export type ColorBoton = 'verde' | 'rosa' | 'borde'

const base =
  'inline-flex h-12 items-center text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200 px-8'

const estilos: Record<ColorBoton, string> = {
  verde: `${base} bg-primary text-primary-foreground hover:bg-primary/90`,
  rosa: `${base} border border-primary/20 bg-rosa text-primary hover:bg-rosa/70`,
  borde: `${base} border border-primary text-primary hover:bg-rosa`,
}

export const estiloBoton = (color: string | null | undefined, porDefecto: ColorBoton): string =>
  estilos[(color as ColorBoton) in estilos ? (color as ColorBoton) : porDefecto]

export const colorBotonField = (
  porDefecto: ColorBoton,
  condition?: (data: { slug?: string } | undefined) => boolean,
): Field => ({
  name: 'colorBoton',
  type: 'select',
  label: 'Color del botón',
  defaultValue: porDefecto,
  options: [
    { label: 'Verde', value: 'verde' },
    { label: 'Rosa', value: 'rosa' },
    { label: 'Solo borde (transparente)', value: 'borde' },
  ],
  admin: condition ? { condition } : undefined,
})
