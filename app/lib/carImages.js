// Centralized car images that actually work
export const carImages = {
  'Toyota Camry': 'https://cdn.imagin.studio/getImage?customer=img&make=toyota&modelFamily=camry&angle=1&zoomtype=fullscreen&width=600',
  'Honda Accord': 'https://cdn.imagin.studio/getImage?customer=img&make=honda&modelFamily=accord&angle=1&zoomtype=fullscreen&width=600',
  'Toyota Corolla': 'https://cdn.imagin.studio/getImage?customer=img&make=toyota&modelFamily=corolla&angle=1&zoomtype=fullscreen&width=600',
  'Lexus RX 350': 'https://cdn.imagin.studio/getImage?customer=img&make=lexus&modelFamily=rx&angle=1&zoomtype=fullscreen&width=600',
  'Mercedes Benz C-Class': 'https://cdn.imagin.studio/getImage?customer=img&make=mercedes&modelFamily=c-class&angle=1&zoomtype=fullscreen&width=600',
  'Hyundai Santa Fe': 'https://cdn.imagin.studio/getImage?customer=img&make=hyundai&modelFamily=santa-fe&angle=1&zoomtype=fullscreen&width=600',
  'Kia Picanto': 'https://cdn.imagin.studio/getImage?customer=img&make=kia&modelFamily=picanto&angle=1&zoomtype=fullscreen&width=600',
  'Toyota Hilux': 'https://cdn.imagin.studio/getImage?customer=img&make=toyota&modelFamily=hilux&angle=1&zoomtype=fullscreen&width=600'
}

// Fallback images if the main ones fail
export const fallbackImages = {
  'Toyota Camry': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop',
  'Honda Accord': 'https://images.unsplash.com/photo-1607853554439-0069f0b29d9c?w=600&h=400&fit=crop',
  'Toyota Corolla': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop',
  'Lexus RX 350': 'https://images.unsplash.com/photo-1533473359331-8405c1d1f6e5?w=600&h=400&fit=crop',
  'Mercedes Benz C-Class': 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&h=400&fit=crop',
  'Hyundai Santa Fe': 'https://images.unsplash.com/photo-1533473359331-8405c1d1f6e5?w=600&h=400&fit=crop',
  'Kia Picanto': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
  'Toyota Hilux': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&h=400&fit=crop'
}

export const getCarImage = (carName) => {
  return carImages[carName] || fallbackImages[carName] || null
}