import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { IMAGE_QUALITY } from '@/utilities/imageQuality'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <Image
      alt="Coco Emilia"
      className={clsx('h-20 w-auto', className)}
      height={512}
      {...(priority === 'high' ? { priority: true } : { loading })}
      quality={IMAGE_QUALITY}
      src="/brand/logo.png"
      width={487}
    />
  )
}
