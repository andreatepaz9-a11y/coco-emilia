'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

// La tienda es siempre clara: se ignoran el modo oscuro del aparato y cualquier preferencia guardada
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState<Theme | undefined>('light')

  const setTheme = useCallback(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
