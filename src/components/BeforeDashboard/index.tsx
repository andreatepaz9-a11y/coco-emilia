import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <h2 className={`${baseClass}__title`}>Panel de Coco Emilia</h2>
      <p>
        Desde aquí administras las páginas, las publicaciones y los archivos de tu tienda.{' '}
        <a href="/" rel="noopener noreferrer" target="_blank">
          Ver la tienda
        </a>
        .
      </p>
    </div>
  )
}

export default BeforeDashboard
