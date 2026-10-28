import Script from 'next/script'
import React from 'react'

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  // La tienda es siempre clara (blanco, crema y rosa): no sigue el modo oscuro del aparato
  document.documentElement.setAttribute('data-theme', 'light')
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
