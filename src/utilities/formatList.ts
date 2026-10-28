/**
 * Une una lista en español: ["rosa", "amarillo", "café"] → "rosa, amarillo y café".
 * Usa "e" en lugar de "y" cuando la última palabra empieza con "i" o "hi" (ej. "rosa e índigo").
 */
export const formatList = (items: string[]): string => {
  const clean = items.map((item) => item.trim()).filter(Boolean)

  if (clean.length === 0) return ''
  if (clean.length === 1) return clean[0]!

  const last = clean[clean.length - 1]!
  const conjunction = /^(i|í|hi)(?!e)/i.test(last) ? 'e' : 'y'

  return `${clean.slice(0, -1).join(', ')} ${conjunction} ${last}`
}
