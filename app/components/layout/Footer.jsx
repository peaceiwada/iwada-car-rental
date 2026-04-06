'use client'

import Link from 'next/link'
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/cars', label: 'Browse Cars' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ]

  const carTypes = [
    { href: '/cars?type=economy', label: 'Economy Cars' },
    { href: '/cars?type=sedan', label: 'Sedans' },
    { href: '/cars?type=suv', label: 'SUVs' },
    { href: '/cars?type=luxury', label: 'Luxury Cars' },
    { href: '/cars?type=van', label: 'Vans & Minivans' },
  ]

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: 'Lagos, Nigeria', href: 'https://maps.google.com' },
    { icon: FaPhone, text: '+234 704 301 6178', href: 'tel:+2347043016178' },
    { icon: FaEnvelope, text: 'ebortypeace81@gmail.com', href: 'mailto:ebortypeace81@gmail.com' },
    { icon: FaClock, text: 'Mon-Sun: 8:00 AM - 8:00 PM', href: null },
  ]

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaCar className="text-2xl text-amber-500" />
              <span className="text-xl font-semibold">Iwada Rentals</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted car rental service in Nigeria. Premium vehicles, affordable prices, and exceptional service.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-slate-500 hover:text-amber-500 transition">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-amber-500 transition">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-amber-500 transition">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-amber-500">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-amber-500 text-sm transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Types */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-amber-500">Car Types</h3>
            <ul className="space-y-2">
              {carTypes.map((type) => (
                <li key={type.href}>
                  <Link href={type.href} className="text-slate-400 hover:text-amber-500 text-sm transition">
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-amber-500">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-400 hover:text-amber-500 text-sm transition"
                    >
                      <info.icon size={14} />
                      <span>{info.text}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <info.icon size={14} />
                      <span>{info.text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-xs">
          <p>&copy; {currentYear} Iwada Car Rental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}