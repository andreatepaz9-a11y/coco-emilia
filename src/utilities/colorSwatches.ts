const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// Nombres de color comunes en español → valor CSS del circulito.
// Los nombres compuestos van antes que los simples ("verde oliva" antes que "verde").
const swatches: [string, string][] = [
  ['verde oliva', '#8a8a4a'],
  ['verde militar', '#4b5320'],
  ['verde menta', '#a8dcc1'],
  ['azul marino', '#1f2d50'],
  ['gris claro', '#d0d0d0'],
  ['gris oscuro', '#555555'],
  ['rosa palo', '#e8b4b8'],
  ['rosa pastel', '#f8cfd9'],
  ['vino tinto', '#6d1f2f'],
  ['multicolor', 'conic-gradient(#e24a4a, #f5d547, #4f8a5b, #2f5dA8, #7b4fa3, #e24a4a)'],

  ['rosa', '#f3a7c2'],
  ['rosado', '#f3a7c2'],
  ['fucsia', '#d81b7e'],
  ['rojo', '#c62828'],
  ['vino', '#6d1f2f'],
  ['guinda', '#6d1f2f'],
  ['coral', '#f26b5b'],
  ['naranja', '#f28c28'],
  ['durazno', '#ffc7a6'],
  ['mostaza', '#d9a521'],
  ['amarillo', '#f5d547'],
  ['dorado', '#c9a24d'],
  ['oro', '#c9a24d'],
  ['plateado', '#c0c0c0'],
  ['plata', '#c0c0c0'],
  ['verde', '#4f8a5b'],
  ['oliva', '#8a8a4a'],
  ['olivo', '#8a8a4a'],
  ['menta', '#a8dcc1'],
  ['esmeralda', '#1f7a5c'],
  ['turquesa', '#30b6b0'],
  ['celeste', '#9cd3f0'],
  ['azul', '#2f5da8'],
  ['marino', '#1f2d50'],
  ['denim', '#5b7fa6'],
  ['mezclilla', '#5b7fa6'],
  ['morado', '#7b4fa3'],
  ['lila', '#c8a2d8'],
  ['lavanda', '#d5c5ee'],
  ['negro', '#1a1a1a'],
  ['blanco', '#ffffff'],
  ['hueso', '#f2ede0'],
  ['crema', '#f5ebdc'],
  ['beige', '#d9c3a0'],
  ['nude', '#e0bfa8'],
  ['camel', '#b98a55'],
  ['cafe', '#6b4226'],
  ['marron', '#6b4226'],
  ['chocolate', '#6b4226'],
  ['gris', '#9a9a9a'],
]

/** "Café", "cafe" y " CAFÉ " son el mismo color. */
export const sameColor = (a: string, b: string) => normalize(a) === normalize(b)

/**
 * Asigna un color a cada foto del producto.
 * - Si alguna foto trae su color marcado en el panel, se respeta tal cual.
 * - Si ninguna lo trae y hay tantas fotos como colores, se asume que las fotos
 *   van en el mismo orden que los colores (1.ª foto = 1.er color, etc.).
 */
export const assignPhotoColors = <T extends { color?: string | null }>(
  photos: T[],
  colors: string[],
): (T & { color: string | null })[] => {
  const tagged = photos.some((photo) => photo.color)
  const byOrder = !tagged && colors.length > 1 && photos.length === colors.length

  return photos.map((photo, i) => ({
    ...photo,
    color: photo.color || (byOrder ? (colors[i] ?? null) : null),
  }))
}

/** Devuelve el fondo CSS del circulito para un nombre de color, o null si no se reconoce. */
export const getSwatchBackground = (name: string): string | null => {
  const key = normalize(name)
  const exact = swatches.find(([word]) => word === key)
  if (exact) return exact[1]

  // "rosa chicle", "azul rey"…: usa la primera palabra de color conocida
  const words = key.split(/\s+/)
  const partial = swatches.find(([word]) => !word.includes(' ') && words.includes(word))
  return partial ? partial[1] : null
}
