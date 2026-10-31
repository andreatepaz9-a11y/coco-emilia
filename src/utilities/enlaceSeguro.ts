const permitido = /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i

export const enlaceSeguro = (enlace: string | null | undefined, porDefecto = '#'): string => {
  const limpio = (enlace ?? '').trim()
  return permitido.test(limpio) ? limpio : porDefecto
}

export const validarEnlace = (value: string | null | undefined): true | string =>
  !value || permitido.test(value.trim()) || 'Usa un enlace que empiece por https://, /, # , mailto: o tel:'
