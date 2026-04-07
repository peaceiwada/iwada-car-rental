'use client'

import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa'

export default function ImageGallery({ images, carName }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [showLightbox, setShowLightbox] = useState(false)

  // If no images, show placeholder
  const displayImages = images && images.length > 0 ? images : ['/images/car-placeholder.jpg']

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  return (
    <div className="space-y-3">
      {/* Main Image with Zoom on Hover */}
      <div 
        className="relative bg-gray-100 rounded-2xl overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div 
          className="relative h-96 cursor-zoom-in overflow-hidden"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={displayImages[currentImage]}
            alt={`${carName} - view ${currentImage + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
            loading="lazy"
          />
          
          {/* Zoom indicator */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <FaExpand size={16} />
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <FaChevronLeft className="text-gray-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          </>
        )}
        
        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentImage + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === idx ? 'border-amber-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`${carName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition"
          >
            <FaTimes />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-3xl hover:text-gray-300 transition p-2"
          >
            <FaChevronLeft />
          </button>
          
          <img
            src={displayImages[currentImage]}
            alt={`${carName} - fullscreen`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-3xl hover:text-gray-300 transition p-2"
          >
            <FaChevronRight />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            {currentImage + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </div>
  )
}