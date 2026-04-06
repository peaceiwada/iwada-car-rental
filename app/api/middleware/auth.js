// Helper to check if user is admin
export const isAdmin = (user) => {
  return user?.role === 'admin'
}

// Helper to check permissions
export const hasPermission = (user, permission) => {
  return user?.permissions?.includes(permission) || false
}