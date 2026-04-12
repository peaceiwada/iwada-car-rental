import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './components/auth/AuthProvider'  // ← Only ONCE
import { CompareProvider } from './context/CompareContext'
import { FavoritesProvider } from './context/FavoritesContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Iwada Car Rental - Premium Car Rental Services in Nigeria',
  description: 'Rent luxury and economy cars at affordable prices. Book your perfect ride today in Lagos, Abuja, and across Nigeria.',
  keywords: 'car rental, Nigeria, luxury cars, economy cars, car hire, Lagos, Abuja',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CompareProvider>
            <FavoritesProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="grow">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </FavoritesProvider>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  )
}