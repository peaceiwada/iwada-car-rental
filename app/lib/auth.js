// Mock authentication helpers
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('iwada_token')
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('iwada_user')
  return user ? JSON.parse(user) : null
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('iwada_token')
}

export const setAuthData = (user, token) => {
  localStorage.setItem('iwada_user', JSON.stringify(user))
  localStorage.setItem('iwada_token', token)
}

export const clearAuthData = () => {
  localStorage.removeItem('iwada_user')
  localStorage.removeItem('iwada_token')
}