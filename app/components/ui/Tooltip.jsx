'use client'

import { useState, useRef, useEffect } from 'react'

export default function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  const showTooltip = () => setIsVisible(true)
  const hideTooltip = () => setIsVisible(false)

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let top = 0
      let left = 0
      
      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
          left = triggerRect.right + 8
          break
        default:
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      }
      
      setCoords({ top, left })
    }
  }, [isVisible, position])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-flex cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn"
          style={{ top: coords.top, left: coords.left }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 rotate-45 -translate-x-1/2 
            ${position === 'top' ? 'bottom-[-4px] left-1/2' : ''}
            ${position === 'bottom' ? 'top-[-4px] left-1/2' : ''}
            ${position === 'left' ? 'right-[-4px] top-1/2' : ''}
            ${position === 'right' ? 'left-[-4px] top-1/2' : ''}
          `} />
        </div>
      )}
    </>
  )
}