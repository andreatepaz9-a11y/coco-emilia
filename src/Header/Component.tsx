import React from 'react'

import { categoryHref, getCategories } from '@/utilities/getCategories'

import { HeaderClient } from './Component.client'

export async function Header() {
  const categories = await getCategories()

  return (
    <HeaderClient
      categories={categories.map((category) => ({
        href: categoryHref(category),
        id: category.id,
        title: category.title,
      }))}
    />
  )
}
