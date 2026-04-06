'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaCar } from 'react-icons/fa'

export default function OptimizedImage({ src, alt, className, width, height, fill = false }) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <FaCar className="text-gray-400 text-4xl" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      onError={() => setError(true)}
      unoptimized={process.env.NODE_ENV === 'development'}
    />
  )
}