import Link from 'next/link'
import React from 'react'

export const AccesoSecciones: React.FC = () => (
  <div style={{ padding: '1.5rem 0' }}>
    <p style={{ marginBottom: '1rem', maxWidth: '36rem' }}>
      Las secciones del inicio (Colecciones, Novedades, Historia, Instagram y las que añadas con
      &quot;Texto con foto&quot;) se ordenan y editan en un solo lugar.
    </p>
    <Link className="btn btn--style-primary btn--size-medium" href="/admin/globals/inicio">
      Editar secciones del inicio
    </Link>
  </div>
)
