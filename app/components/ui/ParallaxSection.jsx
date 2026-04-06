'use client'

import { useEffect, useRef } from 'react'

export default function ParallaxSection({ children, speed = 0.5, className = '' }) {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return
      
      const scrollPosition = window.scrollY
      const sectionTop = sectionRef.current.offsetTop
      const sectionHeight = sectionRef.current.offsetHeight
      
      // Calculate how far the section is from viewport
      const distanceFromTop = scrollPosition - sectionTop
      
      // Move background at different speed
      const yPos = distanceFromTop * speed
      
      bgRef.current.style.transform = `translateY(${yPos}px)`
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}