'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../components/auth/AuthProvider'
import RoleBasedRoute from '../../../components/auth/RoleBasedRoute'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { syncAgentStatus } from '../../../lib/agentStorage'

// Simple icon components to avoid import issues
const FaCar = () => <span className="text-lg">🚗</span>
const FaPlus = () => <span className="text-lg">➕</span>
const FaEdit = () => <span className="text-lg">✏️</span>
const FaTrash = () => <span className="text-lg">🗑️</span>
const FaClock = () => <span className="text-lg">⏰</span>
const FaCheckCircle = () => <span className="text-lg">✅</span>
const FaTimesCircle = () => <span className="text-lg">❌</span>
const FaUser = () => <span className="text-lg">👤</span>
const FaEnvelope = () => <span className="text-lg">📧</span>
const FaPhone = () => <span className="text-lg">📞</span>
const FaWhatsapp = () => <span className="text-lg">💬</span>
const FaMapMarkerAlt = () => <span className="text-lg">📍</span>
const FaStar = () => <span className="text-lg">⭐</span>
const FaMessage = () => <span className="text-lg">💬</span>
const FaShoppingCart = () => <span className="text-lg">🛒</span>
const FaChartLine = () => <span className="text-lg">📊</span>
const FaImage = () => <span className="text-lg">🖼️</span>
const FaReply = () => <span className="text-lg">↩️</span>

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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [contactDetails, setContactDetails] = useState({
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    email: user?.email || '',
    address: user?.businessAddress || ''
  })
  
  const [newCar, setNewCar] = useState({
    name: '',
    type: 'Sedan',
    pricePerDay: '',
    seats: 4,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: '',
    description: '',
    image: null,
    imagePreview: null
  })

  const refreshStatus = () => {
    setRefreshing(true)
    const updatedUser = syncAgentStatus(user?.email)
    if (updatedUser) {
      toast.success('Status updated! Page will refresh.')
      setTimeout(() => window.location.reload(), 1000)
    } else {
      toast.info('Still pending verification.')
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAgentData()
  }, [])

  const fetchAgentData = async () => {
    try {
      const mockCars = [
        { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', status: 'approved', bookings: 12, views: 345, rating: 4.8 },
        { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', status: 'pending', bookings: 0, views: 89, rating: null }
      ]
      setMyCars(mockCars)
      
      const mockOrders = [
        { id: 1, carName: 'Toyota Camry', customerName: 'John Doe', customerPhone: '+234 123 456 7890', pickupDate: '2025-01-15', returnDate: '2025-01-18', totalPrice: 75000, status: 'completed', rating: 5, review: 'Excellent car!', message: 'Great experience!' },
        { id: 2, carName: 'Lexus RX 350', customerName: 'Jane Smith', customerPhone: '+234 987 654 3210', pickupDate: '2025-02-10', returnDate: '2025-02-15', totalPrice: 275000, status: 'upcoming', rating: null, review: null, message: 'Looking forward to it!' }
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      
      setUploadingImage(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewCar({ ...newCar, image: file, imagePreview: reader.result })
        setUploadingImage(false)
        toast.success('Image uploaded!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePostCar = (e) => {
    e.preventDefault()
    if (!isAgentVerified()) {
      toast.error('Account not verified yet')
      return
    }
    if (!newCar.name || !newCar.pricePerDay || !newCar.location) {
      toast.error('Please fill all required fields')
      return
    }
    
    toast.loading('Posting car...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Car submitted for approval!')
      setShowPostForm(false)
      setNewCar({ name: '', type: 'Sedan', pricePerDay: '', seats: 4, fuelType: 'Petrol', transmission: 'Manual', location: '', description: '', image: null, imagePreview: null })
      fetchAgentData()
    }, 1000)
  }

  const handleUpdateContact = () => {
    toast.success('Contact details updated!')
    setShowContactForm(false)
  }

  const handleReplyToMessage = (msgId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply')
      return
    }
    toast.success('Reply sent!')
    setReplyTo(null)
    setReplyText('')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusColor = (status) => {
    const colors = { approved: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800', upcoming: 'bg-blue-100 text-blue-800' }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-pulse text-center"><div className="w-16 h-16 rounded-full bg-blue-500 mx-auto mb-4"></div><p>Loading...</p></div></div>
  }

  return (
    <RoleBasedRoute allowedRoles={['agent']} redirectTo="/dashboard">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            <p className="text-gray-600">Manage your car rental business</p>
          </div>

          {isAgentPending() && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex justify-between items-center flex-wrap gap-4">
              <div><p className="font-semibold">Account Pending Verification</p><p className="text-sm">Awaiting admin approval</p></div>
              <button onClick={refreshStatus} disabled={refreshing} className="bg-yellow-100 px-4 py-2 rounded-lg">🔄 {refreshing ? 'Checking...' : 'Refresh Status'}</button>
            </div>
          )}

          {isAgentVerified() && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <p className="font-semibold">Account Verified!</p>
              <p className="text-sm">You can now post cars for rent</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b flex flex-wrap gap-1 px-4">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'cars', label: 'My Cars', icon: '🚗' },
                { id: 'orders', label: 'Orders', icon: '🛒' },
                { id: 'messages', label: 'Messages', icon: '💬' },
                { id: 'profile', label: 'Profile', icon: '👤' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-500 text-white rounded-xl p-4 text-center"><p className="text-2xl font-bold">{myCars.length}</p><p className="text-sm">Total Cars</p></div>
                    <div className="bg-green-500 text-white rounded-xl p-4 text-center"><p className="text-2xl font-bold">{orders.length}</p><p className="text-sm">Total Orders</p></div>
                    <div className="bg-purple-500 text-white rounded-xl p-4 text-center"><p className="text-2xl font-bold">{formatPrice(orders.reduce((s, o) => s + o.totalPrice, 0))}</p><p className="text-sm">Revenue</p></div>
                    <div className="bg-orange-500 text-white rounded-xl p-4 text-center"><p className="text-2xl font-bold">{orders.filter(o => o.rating).length > 0 ? (orders.reduce((s, o) => s + (o.rating || 0), 0) / orders.filter(o => o.rating).length).toFixed(1) : 'N/A'}</p><p className="text-sm">Avg Rating</p></div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4"><h3 className="font-semibold mb-3">Recent Orders</h3>{orders.slice(0, 3).map(o => <div key={o.id} className="flex justify-between py-2 border-b"><div><p className="font-semibold">{o.carName}</p><p className="text-sm">{o.customerName}</p></div><div className="text-right"><p className="font-bold">{formatPrice(o.totalPrice)}</p><span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(o.status)}`}>{o.status}</span></div></div>)}</div>
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === 'cars' && (
                <div>
                  <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">My Cars</h2>{isAgentVerified() && <button onClick={() => setShowPostForm(!showPostForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">➕ Post New Car</button>}</div>
                  
                  {showPostForm && isAgentVerified() && (
                    <form onSubmit={handlePostCar} className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="font-bold mb-4">Post New Car</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Car Name" className="p-2 border rounded" value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} required />
                        <select className="p-2 border rounded" value={newCar.type} onChange={e => setNewCar({...newCar, type: e.target.value})}><option>Sedan</option><option>SUV</option><option>Economy</option><option>Luxury</option></select>
                        <input type="number" placeholder="Price per Day" className="p-2 border rounded" value={newCar.pricePerDay} onChange={e => setNewCar({...newCar, pricePerDay: e.target.value})} required />
                        <input type="text" placeholder="Location" className="p-2 border rounded" value={newCar.location} onChange={e => setNewCar({...newCar, location: e.target.value})} required />
                        <div className="md:col-span-2">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            {newCar.imagePreview ? (
                              <div className="relative"><img src={newCar.imagePreview} alt="Preview" className="h-32 mx-auto object-cover rounded" /><button type="button" onClick={() => setNewCar({...newCar, image: null, imagePreview: null})} className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded">✕</button></div>
                            ) : (
                              <label className="cursor-pointer block"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /><div className="flex flex-col items-center gap-2">{uploadingImage ? <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <><span className="text-3xl"></span><p className="text-sm">Click to upload car image</p></>}</div></label>
                            )}
                          </div>
                        </div>
                        <textarea placeholder="Description" rows="3" className="md:col-span-2 p-2 border rounded" value={newCar.description} onChange={e => setNewCar({...newCar, description: e.target.value})}></textarea>
                      </div>
                      <div className="flex gap-3 mt-4"><button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Submit</button><button type="button" onClick={() => setShowPostForm(false)} className="bg-gray-200 px-6 py-2 rounded-lg">Cancel</button></div>
                    </form>
                  )}

                  {myCars.length === 0 ? <div className="text-center py-12"><span className="text-6xl">🚗</span><p className="mt-2">No cars listed yet</p></div> : myCars.map(car => (
                    <div key={car.id} className="bg-gray-50 rounded-xl p-4 mb-3"><div className="flex justify-between"><div><h3 className="font-semibold">{car.name}</h3><p className="text-sm">{car.type} • {car.location} • {formatPrice(car.pricePerDay)}/day</p></div><div><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(car.status)}`}>{car.status}</span><div className="flex gap-2 mt-2"><button className="text-blue-600">✏️</button><button className="text-red-600">🗑️</button></div></div></div></div>
                  ))}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>{orders.length === 0 ? <div className="text-center py-12"><span className="text-6xl">🛒</span><p>No orders yet</p></div> : orders.map(order => <div key={order.id} className="bg-gray-50 rounded-xl p-4 mb-3"><div className="flex justify-between"><div><h3 className="font-semibold">{order.carName}</h3><p className="text-sm">{order.customerName} • {order.customerPhone}</p><p className="text-sm">📅 {formatDate(order.pickupDate)} - {formatDate(order.returnDate)}</p></div><div className="text-right"><p className="font-bold">{formatPrice(order.totalPrice)}</p><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></div></div>{order.message && <div className="mt-2 p-2 bg-blue-50 rounded text-sm">💬 {order.message}</div>}</div>)}</div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div>{messages.length === 0 ? <div className="text-center py-12"><span className="text-6xl">💬</span><p>No messages yet</p></div> : messages.map(msg => <div key={msg.id} className={`bg-gray-50 rounded-xl p-4 mb-3 ${!msg.isRead ? 'border-l-4 border-blue-500' : ''}`}><div className="flex justify-between"><div><h3 className="font-semibold">{msg.customerName}</h3><p className="text-sm">{msg.message}</p>{msg.reply && <p className="text-sm text-green-600 mt-1">📎 Your reply: {msg.reply}</p>}</div>{!msg.reply && <button onClick={() => setReplyTo(msg.id)} className="text-blue-600">↩️ Reply</button>}</div>{replyTo === msg.id && <div className="mt-3"><textarea rows="2" className="w-full p-2 border rounded" placeholder="Type reply..." value={replyText} onChange={e => setReplyText(e.target.value)} /><div className="flex gap-2 mt-2"><button onClick={() => handleReplyToMessage(msg.id)} className="bg-blue-600 text-white px-4 py-1 rounded">Send</button><button onClick={() => setReplyTo(null)} className="bg-gray-200 px-4 py-1 rounded">Cancel</button></div></div>}</div>)}</div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between mb-4"><h3 className="font-semibold">Contact Details</h3><button onClick={() => setShowContactForm(!showContactForm)} className="text-blue-600 text-sm">{showContactForm ? 'Cancel' : 'Edit'}</button></div>
                    {showContactForm ? (
                      <div className="space-y-3">
                        <input type="tel" placeholder="Phone" className="w-full p-2 border rounded" value={contactDetails.phone} onChange={e => setContactDetails({...contactDetails, phone: e.target.value})} />
                        <input type="tel" placeholder="WhatsApp" className="w-full p-2 border rounded" value={contactDetails.whatsapp} onChange={e => setContactDetails({...contactDetails, whatsapp: e.target.value})} />
                        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={contactDetails.email} onChange={e => setContactDetails({...contactDetails, email: e.target.value})} />
                        <textarea placeholder="Address" rows="2" className="w-full p-2 border rounded" value={contactDetails.address} onChange={e => setContactDetails({...contactDetails, address: e.target.value})} />
                        <button onClick={handleUpdateContact} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save</button>
                      </div>
                    ) : (
                      <div className="space-y-2"><p>📞 {user?.phone || 'Not set'}</p><p>💬 {user?.whatsapp || 'Not set'}</p><p>📧 {user?.email}</p><p>📍 {user?.businessAddress || 'Not set'}</p></div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 mt-6"><h3 className="font-semibold mb-3">Business Info</h3><p><span className="font-medium">Business Name:</span> {user?.businessName}</p><p><span className="font-medium">Registered:</span> {formatDate(user?.registrationDate)}</p>{user?.verifiedAt && <p><span className="font-medium">Verified:</span> {formatDate(user?.verifiedAt)}</p>}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleBasedRoute>
  )
}