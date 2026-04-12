'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../auth/AuthProvider'
import { FaCar, FaUser, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt, FaHome, FaCarSide, FaTachometerAlt, FaEnvelope } from 'react-icons/fa'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout, isAuthenticated, isAdmin, isAgent } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard'      // ← CHANGED: /admin/dashboard → /admin/dashboard
    if (isAgent) return '/agent/dashboard'
    if (isAuthenticated) return '/user/dashboard'
    return '/login'
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/cars', label: 'Cars', icon: FaCarSide },
    ...(isAuthenticated ? [{ href: getDashboardLink(), label: 'Dashboard', icon: FaTachometerAlt }] : []),
    { href: '/contact', label: 'Contact', icon: FaEnvelope }
  ]

  const isActive = (path) => pathname === path

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group" onClick={() => setIsMenuOpen(false)}>
              <div className="relative">
                <FaCar className="text-3xl text-teal-700 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-sm"></div>
              </div>
              <span className="text-2xl font-bold gradient-text">
                Iwada Rentals
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-teal-700'
                      : 'text-slate-600 hover:text-amber-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <link.icon size={16} />
                    {link.label}
                  </span>
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 rounded-full animate-fadeInUp" />
                  )}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                      <FaShieldAlt size={12} />
                      <span>Admin</span>
                    </div>
                  )}
                  {isAgent && (
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                      <FaCar size={12} />
                      <span>Agent</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-amber-50 rounded-full px-4 py-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-600 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors font-medium"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-teal-600 font-semibold hover:text-amber-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary px-6 py-2 text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <FaBars size={24} className="text-teal-700" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMenuOpen(false)} />
      
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-amber-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaCar className="text-2xl text-teal-600" />
              <span className="text-xl font-bold gradient-text">Iwada Rentals</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <FaTimes size={20} className="text-slate-600" />
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <div className="p-4 bg-gradient-to-r from-teal-50 to-amber-50 m-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-amber-600 flex items-center justify-center text-white text-lg font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  {(isAdmin || isAgent) && (
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                      isAdmin ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isAdmin ? 'Admin' : 'Agent'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <link.icon size={18} />
                <span className="font-medium">{link.label}</span>
                {isActive(link.href) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-amber-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-amber-600 rounded-xl font-medium hover:bg-amber-100 transition-colors"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-teal-600 text-teal-600 rounded-xl font-medium hover:bg-teal-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}