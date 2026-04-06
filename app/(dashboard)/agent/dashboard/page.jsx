'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../components/auth/AuthProvider'
import RoleBasedRoute from '../../../components/auth/RoleBasedRoute'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { syncAgentStatus } from '../../../lib/agentStorage'

export default function AgentDashboard() {
  const { user, isAgentVerified, isAgentPending } = useAuth()
  const [myCars, setMyCars] = useState([])
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPostForm, setShowPostForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [contactDetails, setContactDetails] = useState({
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    email: user?.email || '',
    address: user?.businessAddress || ''
  })

  const refreshStatus = () => {
    setRefreshing(true)
    const updatedUser = syncAgentStatus(user?.email)
    if (updatedUser && updatedUser.agentStatus === 'verified') {
      toast.success('Account verified! Redirecting...')
      setTimeout(() => {
        window.location.href = '/agent/dashboard'
      }, 1000)
    } else {
      toast.info('Still pending verification. Please wait for admin approval.')
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAgentData()
  }, [])

  const fetchAgentData = async () => {
    try {
      const mockCars = [
        { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, location: 'Lagos', status: 'approved', bookings: 12, views: 345, rating: 4.8 },
        { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, location: 'Lagos', status: 'pending', bookings: 0, views: 89, rating: null }
      ]
      setMyCars(mockCars)
      
      const mockOrders = [
        { id: 1, carName: 'Toyota Camry', customerName: 'John Doe', customerPhone: '+234 123 456 7890', pickupDate: '2025-01-15', returnDate: '2025-01-18', totalPrice: 75000, status: 'completed', rating: 5, review: 'Excellent car!', message: 'Great experience!' },
        { id: 2, carName: 'Lexus RX 350', customerName: 'Jane Smith', customerPhone: '+234 987 654 3210', pickupDate: '2025-02-10', returnDate: '2025-02-15', totalPrice: 275000, status: 'upcoming', rating: null, review: null, message: 'Looking forward to the rental!' }
      ]
      setOrders(mockOrders)
      
      const mockMessages = [
        { id: 1, customerName: 'John Doe', message: 'Is the car available for extended rental?', reply: 'Yes, we can extend.', date: '2025-01-11T09:00:00Z', isRead: true },
        { id: 2, customerName: 'Jane Smith', message: 'Can I pick up the car earlier?', reply: null, date: '2025-01-21T14:30:00Z', isRead: false }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error fetching agent data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCar = async (e) => {
    e.preventDefault()
    if (!isAgentVerified()) {
      toast.error('Your account is not verified. Please complete verification first.')
      return
    }
    toast.loading('Posting car for review...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Car submitted for admin approval!')
      setShowPostForm(false)
    }, 1500)
  }

  const handleUpdateContact = () => {
    toast.success('Contact details updated successfully!')
    setShowContactForm(false)
  }

  const handleReplyToMessage = (messageId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply')
      return
    }
    toast.success('Reply sent successfully!')
    setReplyTo(null)
    setReplyText('')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusBadge = (status) => {
    const config = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return config[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Only show dashboard content if agent is verified
  // The RoleBasedRoute will handle redirection for unverified agents
  return (
    <RoleBasedRoute allowedRoles={['agent']} redirectTo="/">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your car rental business</p>
          </div>

          {/* Verified Banner - Only shown when verified */}
          {isAgentVerified() && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">Account Verified!</h3>
                  <p className="text-sm text-green-700">You can now post cars for rent.</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl mb-2">🚗</div>
              <p className="text-2xl font-bold">{myCars.length}</p>
              <p className="text-sm text-gray-500">Total Cars</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold">{formatPrice(orders.reduce((sum, o) => sum + o.totalPrice, 0))}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.rating).length > 0 
                  ? (orders.reduce((sum, o) => sum + (o.rating || 0), 0) / orders.filter(o => o.rating).length).toFixed(1)
                  : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Avg Rating</p>
            </div>
          </div>

          {/* Quick Actions - Only shown when verified */}
          {isAgentVerified() && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition"
              >
                {showPostForm ? '❌ Cancel' : '➕ Post New Car'}
              </button>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition"
              >
                {showContactForm ? '❌ Cancel' : '✏️ Edit Profile'}
              </button>
            </div>
          )}

          {/* Post Car Form - Only shown when verified */}
          {showPostForm && isAgentVerified() && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Post New Car</h2>
              <form onSubmit={handlePostCar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Car Name" className="w-full p-3 border rounded-lg" required />
                  <select className="w-full p-3 border rounded-lg">
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Luxury</option>
                    <option>Economy</option>
                  </select>
                  <input type="number" placeholder="Price per Day (₦)" className="w-full p-3 border rounded-lg" required />
                  <input type="text" placeholder="Location" className="w-full p-3 border rounded-lg" required />
                  <textarea placeholder="Description" rows="3" className="w-full p-3 border rounded-lg md:col-span-2" required />
                </div>
                <button type="submit" className="w-full bg-amber-600 text-white p-3 rounded-lg font-semibold hover:bg-amber-700 transition">
                  Submit for Approval
                </button>
              </form>
            </div>
          )}

          {/* Edit Profile Form - Only shown when verified */}
          {showContactForm && isAgentVerified() && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Edit Contact Details</h2>
              <div className="space-y-4">
                <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg" value={contactDetails.phone} onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})} />
                <input type="tel" placeholder="WhatsApp Number" className="w-full p-3 border rounded-lg" value={contactDetails.whatsapp} onChange={(e) => setContactDetails({...contactDetails, whatsapp: e.target.value})} />
                <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={contactDetails.email} onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})} />
                <textarea placeholder="Business Address" rows="2" className="w-full p-3 border rounded-lg" value={contactDetails.address} onChange={(e) => setContactDetails({...contactDetails, address: e.target.value})} />
                <button onClick={handleUpdateContact} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Tabs - Only shown when verified */}
          {isAgentVerified() && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="flex border-b">
                {['overview', 'cars', 'orders', 'messages', 'profile'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition ${activeTab === tab ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab === 'overview' && '📊 Overview'}
                    {tab === 'cars' && '🚗 My Cars'}
                    {tab === 'orders' && '📦 Orders'}
                    {tab === 'messages' && '💬 Messages'}
                    {tab === 'profile' && '👤 Profile'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No orders yet</p>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="border-b py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold">{order.carName}</p>
                              <p className="text-sm text-gray-500">{order.customerName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-amber-600">{formatPrice(order.totalPrice)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>{order.status}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Cars Tab */}
                {activeTab === 'cars' && (
                  <div>
                    {myCars.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No cars listed yet</p>
                    ) : (
                      myCars.map((car) => (
                        <div key={car.id} className="border-b py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold">{car.name}</p>
                              <p className="text-sm text-gray-500">{car.type} • {car.location}</p>
                              <p className="text-sm text-amber-600 font-semibold">{formatPrice(car.pricePerDay)}/day</p>
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(car.status)}`}>{car.status}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No orders yet</p>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="border-b py-4">
                          <p className="font-semibold">{order.carName}</p>
                          <p className="text-sm">👤 {order.customerName}</p>
                          <p className="text-sm">📞 {order.customerPhone}</p>
                          <p className="text-sm">📅 {formatDate(order.pickupDate)} - {formatDate(order.returnDate)}</p>
                          <p className="font-semibold text-amber-600">{formatPrice(order.totalPrice)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>{order.status}</span>
                          {order.message && <p className="text-sm text-blue-600 mt-2">💬 {order.message}</p>}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div>
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No messages yet</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`border-b py-4 ${!msg.isRead ? 'bg-blue-50 -mx-6 px-6' : ''}`}>
                          <p className="font-semibold">👤 {msg.customerName}</p>
                          <p className="text-gray-600 mt-1">💬 {msg.message}</p>
                          {msg.reply && <p className="text-green-600 mt-2">📎 Your reply: {msg.reply}</p>}
                          <p className="text-xs text-gray-400 mt-2">{formatDate(msg.date)}</p>
                          {!msg.reply && (
                            <div className="mt-3">
                              {replyTo === msg.id ? (
                                <div>
                                  <textarea rows="2" className="w-full p-2 border rounded-lg" placeholder="Type your reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                                  <div className="flex gap-2 mt-2">
                                    <button onClick={() => handleReplyToMessage(msg.id)} className="bg-amber-600 text-white px-4 py-1 rounded-lg text-sm">Send</button>
                                    <button onClick={() => setReplyTo(null)} className="bg-gray-200 px-4 py-1 rounded-lg text-sm">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <button onClick={() => setReplyTo(msg.id)} className="text-amber-600 text-sm">↩️ Reply</button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="space-y-3">
                      <p><span className="font-semibold">🏢 Business:</span> {user?.businessName || 'Not set'}</p>
                      <p><span className="font-semibold">👤 Name:</span> {user?.name}</p>
                      <p><span className="font-semibold">📧 Email:</span> {user?.email}</p>
                      <p><span className="font-semibold">📞 Phone:</span> {user?.phone || 'Not set'}</p>
                      <p><span className="font-semibold">💬 WhatsApp:</span> {user?.whatsapp || 'Not set'}</p>
                      <p><span className="font-semibold">📍 Address:</span> {user?.businessAddress || 'Not set'}</p>
                      <p><span className="font-semibold">📅 Registered:</span> {formatDate(user?.registrationDate)}</p>
                      {user?.verifiedAt && <p><span className="font-semibold">✅ Verified:</span> {formatDate(user?.verifiedAt)} by {user?.verifiedBy}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleBasedRoute>
  )
}