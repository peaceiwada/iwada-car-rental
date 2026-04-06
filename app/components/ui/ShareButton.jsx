'use client'

import { useState } from 'react'
import { FaShare, FaWhatsapp, FaFacebook, FaTwitter, FaLink, FaTimes, FaCheck } from 'react-icons/fa'

export default function ShareButton({ car }) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = {
    title: car.name,
    text: `Check out this ${car.name} at Iwada Rentals! Price: ₦${car.pricePerDay.toLocaleString()}/day`,
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/cars/${car.id}`
  }

  const handleShare = async (platform) => {
    const message = `${shareData.text}\n\n${shareData.url}`
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank')
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(message)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        alert('Failed to copy link')
      }
    }
  }

  const shareOptions = [
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'bg-green-500 hover:bg-green-600', textColor: 'text-green-500' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'bg-blue-600 hover:bg-blue-700', textColor: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'bg-sky-500 hover:bg-sky-600', textColor: 'text-sky-500' },
    { id: 'copy', name: copied ? 'Copied!' : 'Copy Link', icon: copied ? FaCheck : FaLink, color: 'bg-gray-600 hover:bg-gray-700', textColor: 'text-gray-600' }
  ]

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-all duration-300 border border-amber-200"
      >
        <FaShare size={14} />
        Share
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeInUp overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaShare className="text-white text-lg" />
                <h3 className="text-white font-bold text-lg">Share this car</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Car Preview */}
            <div className="px-6 pt-4 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <FaWhatsapp className="text-amber-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{car.name}</p>
                  <p className="text-sm text-amber-600 font-bold">₦{car.pricePerDay.toLocaleString()}/day</p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Share via:</p>
              <div className="grid grid-cols-4 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleShare(option.id)}
                    className={`${option.color} text-white p-3 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105`}
                  >
                    <option.icon size={20} />
                    <span className="text-xs font-medium">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* Share Message Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Message preview:</p>
                <p className="text-sm text-gray-700">
                  Check out this {car.name} at Iwada Rentals! 
                  Price: ₦{car.pricePerDay.toLocaleString()}/day
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}