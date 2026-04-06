import Link from 'next/link'
import { FaCar, FaHome } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <FaCar className="text-6xl text-gray-400 mx-auto mb-4 animate-float" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            <FaHome /> Go Home
          </Link>
          <Link 
            href="/cars" 
            className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            <FaCar /> Browse Cars
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <span className="text-gray-300">•</span>
            <Link href="/cars" className="text-gray-600 hover:text-blue-600">Cars</Link>
            <span className="text-gray-300">•</span>
            <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <span className="text-gray-300">•</span>
            <Link href="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  )
}