import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-28">
      <h1 className="mb-4 font-serif text-6xl">404</h1>
      <p className="mb-8 text-lg">No encontramos la página que buscas.</p>
      <Button asChild variant="default">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
