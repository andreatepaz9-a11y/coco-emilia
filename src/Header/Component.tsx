import React from 'react'

import { categoryHref, getCategories } from '@/utilities/getCategories'
import { getPaginasMenu } from '@/utilities/getPaginasMenu'

import { HeaderClient } from './Component.client'

export async function Header() {
  const [categories, paginas] = await Promise.all([getCategories(), getPaginasMenu()])

  return (
    <HeaderClient
      paginas={paginas}
      categories={categories.map((category) => ({
        href: categoryHref(category),
        id: category.id,
        title: category.title,
      }))}
    />
  )
}
