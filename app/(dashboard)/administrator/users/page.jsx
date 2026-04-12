'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AdminRoute } from '../../../components/auth/ProtectedRoute'
import { getUsers, updateUser, getBookingsByUser } from '../../../lib/storage'
import { UserRole, AgentStatus, formatNaira, formatDate } from '../../../lib/constants'
import { 
  FaUsers, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaEye,
  FaBan,
  FaUserCheck,
  FaShieldAlt,
  FaStore,
  FaStar
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userBookings, setUserBookings] = useState([])

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, filterRole])

  const loadUsers = () => {
    try {
      const allUsers = getUsers()
      
      // If no users in storage, use mock data
      if (allUsers.length === 0) {
        const mockUsers = [
          { 
            id: 1, name: 'Admin User', email: 'admin@iwada.com', phone: '+234 123 456 7890', 
            role: UserRole.ADMIN, status: 'active', createdAt: '2024-01-01T10:00:00Z',
            avatar: null
          },
          { 
            id: 2, name: 'John Booker', email: 'john@example.com', phone: '+234 801 234 5678', 
            role: UserRole.BOOKER, status: 'active', createdAt: '2024-02-15T14:30:00Z',
            userProfile: { preferredLocation: 'Lagos', totalSpent: 275000, totalBookings: 3 }
          },
          { 
            id: 3, name: 'Jane Smith', email: 'jane@example.com', phone: '+234 802 345 6789', 
            role: UserRole.BOOKER, status: 'active', createdAt: '2024-03-10T09:15:00Z',
            userProfile: { preferredLocation: 'Abuja', totalSpent: 180000, totalBookings: 2 }
          },
          { 
            id: 4, name: 'Premium Rentals', email: 'agent@example.com', phone: '+234 803 456 7890', 
            role: UserRole.AGENT, status: 'active', createdAt: '2024-01-20T11:45:00Z',
            agentStatus: AgentStatus.VERIFIED, agentVerification: { businessInfo: { businessName: 'Premium Rentals', businessAddress: 'Lagos, Nigeria' } },
            agentStats: { totalListings: 5, totalBookings: 12, totalEarnings: 450000, averageRating: 4.8 }
          },
          { 
            id: 5, name: 'Elite Autos', email: 'elite@example.com', phone: '+234 804 567 8901', 
            role: UserRole.AGENT, status: 'active', createdAt: '2024-02-05T16:20:00Z',
            agentStatus: AgentStatus.PENDING, agentVerification: { businessInfo: { businessName: 'Elite Autos', businessAddress: 'Abuja, Nigeria' } }
          },
          { 
            id: 6, name: 'Suspended User', email: 'suspended@example.com', phone: '+234 805 678 9012', 
            role: UserRole.BOOKER, status: 'suspended', createdAt: '2024-01-10T08:00:00Z'
          }
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
      } else {
        setUsers(allUsers)
        setFilteredUsers(allUsers)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Error loading users')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.includes(query))
      )
    }
    
    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole)
    }
    
    setFilteredUsers(filtered)
  }

  const handleSuspendUser = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate'
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return
    }
    
    setProcessingId(userId)
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
      const result = updateUser(userId, { status: newStatus })
      if (result) {
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
        loadUsers()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Error updating user status')
    } finally {
      setProcessingId(null)
    }
  }

  const handleViewUserDetails = async (selectedUser) => {
    setSelectedUser(selectedUser)
    const bookings = getBookingsByUser(selectedUser.id)
    setUserBookings(bookings)
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case UserRole.ADMIN:
        return { color: 'bg-purple-100 text-purple-700', icon: FaShieldAlt, label: 'Admin' }
      case UserRole.AGENT:
        return { color: 'bg-amber-100 text-amber-700', icon: FaStore, label: 'Agent' }
      case UserRole.BOOKER:
        return { color: 'bg-blue-100 text-blue-700', icon: FaUser, label: 'User' }
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: FaUser, label: role }
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return { color: 'bg-green-100 text-green-700', icon: FaCheckCircle, label: 'Active' }
    }
    return { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, label: 'Suspended' }
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === UserRole.ADMIN).length,
    agents: users.filter(u => u.role === UserRole.AGENT).length,
    bookers: users.filter(u => u.role === UserRole.BOOKER).length
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all users on the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <div className="bg-red-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaBan className="text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaShieldAlt className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agents</p>
                <p className="text-2xl font-bold text-amber-600">{stats.agents}</p>
              </div>
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaStore className="text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.bookers}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaUser className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <FaFilter className="text-gray-500" />
                <span>Filter</span>
              </button>
              {(filterRole !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterRole('all')
                  }}
                  className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterRole === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setFilterRole(UserRole.ADMIN)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterRole === UserRole.ADMIN ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setFilterRole(UserRole.AGENT)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterRole === UserRole.AGENT ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Agents
              </button>
              <button
                onClick={() => setFilterRole(UserRole.BOOKER)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterRole === UserRole.BOOKER ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Users
              </button>
            </div>
          )}
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-amber-500 text-3xl" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Users Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">User</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Role</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Joined</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((userData) => {
                    const RoleBadge = getRoleBadge(userData.role)
                    const StatusBadge = getStatusBadge(userData.status)
                    return (
                      <tr key={userData.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                              {userData.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{userData.name}</p>
                              <p className="text-xs text-gray-500">{userData.email}</p>
                              {userData.phone && <p className="text-xs text-gray-400">{userData.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${RoleBadge.color}`}>
                            <RoleBadge.icon size={10} />
                            {RoleBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${StatusBadge.color}`}>
                            <StatusBadge.icon size={10} />
                            {StatusBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(userData.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewUserDetails(userData)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <FaEye size={16} />
                            </button>
                            {userData.id !== user?.id && (
                              <button
                                onClick={() => handleSuspendUser(userData.id, userData.status)}
                                disabled={processingId === userData.id}
                                className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                                  userData.status === 'active' 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={userData.status === 'active' ? 'Suspend User' : 'Activate User'}
                              >
                                {processingId === userData.id ? <FaSpinner className="animate-spin" size={14} /> : (userData.status === 'active' ? <FaBan size={14} /> : <FaUserCheck size={14} />)}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* User Info */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                      <p className="text-amber-100">{selectedUser.email}</p>
                      {selectedUser.phone && <p className="text-amber-100 text-sm">{selectedUser.phone}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-semibold text-gray-800 capitalize">{selectedUser.role}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`font-semibold capitalize ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-800">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="font-semibold text-gray-800 text-sm">{selectedUser.id}</p>
                  </div>
                </div>
                
                {/* Agent Specific Info */}
                {selectedUser.role === UserRole.AGENT && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Agent Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Business Name</p>
                        <p className="font-semibold text-gray-800">{selectedUser.agentVerification?.businessInfo?.businessName || selectedUser.businessName || 'N/A'}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Business Address</p>
                        <p className="font-semibold text-gray-800">{selectedUser.agentVerification?.businessInfo?.businessAddress || selectedUser.businessAddress || 'N/A'}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Verification Status</p>
                        <p className={`font-semibold capitalize ${
                          selectedUser.agentStatus === AgentStatus.VERIFIED ? 'text-green-600' :
                          selectedUser.agentStatus === AgentStatus.PENDING ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selectedUser.agentStatus || 'Not Submitted'}
                        </p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Total Listings</p>
                        <p className="font-semibold text-gray-800">{selectedUser.agentStats?.totalListings || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* User Stats */}
                {selectedUser.role === UserRole.BOOKER && selectedUser.userProfile && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">User Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Preferred Location</p>
                        <p className="font-semibold text-gray-800">{selectedUser.userProfile.preferredLocation || 'Not set'}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Total Bookings</p>
                        <p className="font-semibold text-gray-800">{selectedUser.userProfile.totalBookings || 0}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 col-span-2">
                        <p className="text-xs text-gray-500">Total Spent</p>
                        <p className="font-semibold text-amber-600">{formatNaira(selectedUser.userProfile.totalSpent || 0)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Recent Bookings */}
                {userBookings.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Recent Bookings ({userBookings.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {userBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{booking.carName}</p>
                              <p className="text-xs text-gray-500">{formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</p>
                            </div>
                            <p className="font-bold text-amber-600 text-sm">{formatNaira(booking.totalPrice)}</p>
                          </div>
                          <p className={`text-xs mt-1 capitalize ${
                            booking.status === 'completed' ? 'text-green-600' :
                            booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {booking.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  )
}