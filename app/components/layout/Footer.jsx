'use client'

import Link from 'next/link'
import { 
  FaCar, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, 
  FaPhone, FaEnvelope, FaWhatsapp, FaArrowRight
} from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/cars', label: 'Browse Cars' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
  ]

  const socialLinks = [
    { icon: FaFacebook, url: '#', bg: 'bg-blue-600' },
    { icon: FaTwitter, url: '#', bg: 'bg-sky-500' },
    { icon: FaInstagram, url: '#', bg: 'bg-pink-600' },
    { icon: FaWhatsapp, url: '#', bg: 'bg-green-500' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Simple Background Accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* Footer Grid - Simplified */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          
          {/* Brand */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl">
                <FaCar className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Iwada Rentals
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium car rental service in Nigeria. Best prices, wide selection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-amber-400">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaPhone className="text-green-400 text-xs" /> +234 123 456 7890
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaWhatsapp className="text-emerald-400 text-xs" /> +234 123 456 7890
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaEnvelope className="text-blue-400 text-xs" /> info@iwadarentals.com
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaMapMarkerAlt className="text-red-400 text-xs" /> Lagos, Nigeria
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-amber-400">Follow Us</h3>
            <div className="flex justify-center sm:justify-start gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={`${social.bg} p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                >
                  <social.icon className="text-white text-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clean */}
        <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center">
          <p className="text-slate-500 text-xs">
            © {currentYear} Iwada Car Rental. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Privacy</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}