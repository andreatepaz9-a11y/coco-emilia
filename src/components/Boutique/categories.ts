export type BoutiqueCategory = {
  slug: string
  name: string
  /** Nombre corto para el menú, si el nombre completo es largo */
  shortName?: string
  /** La ropa y el calzado van arriba en el mosaico y los accesorios abajo */
  group: 'ropa' | 'accesorios'
  /** Foto de la categoría. Sin foto, el mosaico muestra un bloque de color con el nombre. */
  image?: string
  alt?: string
  tint: 'rosa' | 'crema'
}

export const boutiqueCategories: BoutiqueCategory[] = [
  // Ropa y calzado
  {
    slug: 'moda',
    name: 'Moda',
    group: 'ropa',
    image: '/brand/moda.jpg',
    alt: 'Colección de moda',
    tint: 'rosa',
  },
  {
    slug: 'deportiva',
    name: 'Deportiva',
    group: 'ropa',
    image: '/brand/deportiva.jpg',
    alt: 'Colección de ropa deportiva',
    tint: 'crema',
  },
  {
    slug: 'pijamas',
    name: 'Pijamas',
    group: 'ropa',
    image: '/brand/pijamas.jpg',
    alt: 'Colección de pijamas',
    tint: 'rosa',
  },
  {
    slug: 'zapatos',
    name: 'Zapatos',
    group: 'ropa',
    image: '/brand/zapatos.jpg',
    alt: 'Colección de zapatos',
    tint: 'crema',
  },
  // Accesorios
  {
    slug: 'joyeria',
    name: 'Joyería',
    group: 'accesorios',
    image: '/brand/joyeria.jpg',
    alt: 'Colección de joyería',
    tint: 'rosa',
  },
  {
    slug: 'bolsos',
    name: 'Bolsos',
    group: 'accesorios',
    image: '/brand/carteras.jpg',
    alt: 'Colección de bolsos y carteras',
    tint: 'crema',
  },
  {
    slug: 'cabello',
    name: 'Cabello',
    group: 'accesorios',
    image: '/brand/cabello.jpg',
    alt: 'Accesorios y cuidado del cabello',
    tint: 'rosa',
  },
]

export const categoryGroups: { id: BoutiqueCategory['group']; label: string }[] = [
  { id: 'ropa', label: 'Ropa y calzado' },
  { id: 'accesorios', label: 'Accesorios' },
]

export const categoryHref = (category: Pick<BoutiqueCategory, 'slug'>) =>
  `/coleccion/${category.slug}`

export const getCategory = (slug: string) =>
  boutiqueCategories.find((category) => category.slug === slug)
