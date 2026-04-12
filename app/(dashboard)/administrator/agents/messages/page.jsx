'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByAgent, getMessages, saveMessage, getUsers } from '../../../lib/storage'
import { formatDate } from '../../../lib/constants'
import { 
  FaEnvelope, 
  FaUser, 
  FaPhone, 
  FaCar,
  FaPaperPlane,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaReply
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AgentMessagesPage() {
  const router = useRouter()
  const { user, isAgentVerified } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isAgentVerified && user) {
      loadConversations()
    }
  }, [isAgentVerified, user])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.userId)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = () => {
    try {
      // Get all bookings for this agent
      const agentBookings = getBookingsByAgent(user?.id)
      
      // Get unique customers who have booked
      const uniqueCustomers = new Map()
      
      agentBookings.forEach(booking => {
        if (!uniqueCustomers.has(booking.userId)) {
          uniqueCustomers.set(booking.userId, {
            userId: booking.userId,
            userName: booking.userName,
            userEmail: booking.userEmail,
            userPhone: booking.userPhone,
            carName: booking.carName,
            bookingId: booking.id,
            lastMessage: '',
            lastMessageTime: booking.createdAt,
            unreadCount: 0
          })
        }
      })
      
      // Get messages to determine last message and unread count
      const allMessages = getMessages()
      
      uniqueCustomers.forEach((customer, userId) => {
        const customerMessages = allMessages.filter(msg => 
          (msg.fromUserId === userId && msg.toUserId === user?.id) ||
          (msg.fromUserId === user?.id && msg.toUserId === userId)
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        if (customerMessages.length > 0) {
          customer.lastMessage = customerMessages[0].message
          customer.lastMessageTime = customerMessages[0].createdAt
        }
        
        const unreadMessages = allMessages.filter(msg => 
          msg.fromUserId === userId && 
          msg.toUserId === user?.id && 
          !msg.read
        )
        customer.unreadCount = unreadMessages.length
      })
      
      setConversations(Array.from(uniqueCustomers.values()))
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Error loading messages')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = (userId) => {
    try {
      const allMessages = getMessages()
      const conversationMessages = allMessages.filter(msg => 
        (msg.fromUserId === userId && msg.toUserId === user?.id) ||
        (msg.fromUserId === user?.id && msg.toUserId === userId)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      
      setMessages(conversationMessages)
      
      // Mark unread messages as read
      conversationMessages.forEach(msg => {
        if (msg.fromUserId === userId && msg.toUserId === user?.id && !msg.read) {
          // In a real app, you would update the read status
          console.log('Mark message as read:', msg.id)
        }
      })
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedConversation) return
    
    setSending(true)
    
    try {
      const messageData = {
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: selectedConversation.userId,
        toUserName: selectedConversation.userName,
        message: newMessage.trim(),
        conversationId: `${user.id}_${selectedConversation.userId}`
      }
      
      const saved = saveMessage(messageData)
      
      if (saved) {
        setNewMessage('')
        loadMessages(selectedConversation.userId)
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.userId === selectedConversation.userId
            ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
            : conv
        ))
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message')
    } finally {
      setSending(false)
    }
  }

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))} min ago`
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else {
      return formatDate(dateString)
    }
  }

  if (!isAgentVerified) {
    return null
  }

  return (
    <AgentRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/agent/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">Communicate with your customers</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-gray-100 overflow-y-auto">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Conversations</h2>
                <p className="text-xs text-gray-500">{conversations.length} chats</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <FaSpinner className="animate-spin text-amber-500 text-2xl" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">💬</div>
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">When customers book your cars, you can message them here</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-all border-b border-gray-100 ${
                        selectedConversation?.userId === conv.userId ? 'bg-amber-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {conv.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-800 truncate">{conv.userName}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{conv.carName}</p>
                          <p className="text-sm text-gray-600 truncate mt-1">{conv.lastMessage || 'No messages yet'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {conv.lastMessageTime ? formatMessageTime(conv.lastMessageTime) : 'Recently'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col h-full">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {selectedConversation.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedConversation.userName}</h3>
                        <p className="text-xs text-gray-500">Booking: {selectedConversation.carName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedConversation.userPhone && (
                        <a href={`tel:${selectedConversation.userPhone}`} className="text-gray-400 hover:text-amber-600">
                          <FaPhone size={18} />
                        </a>
                      )}
                      {selectedConversation.userEmail && (
                        <a href={`mailto:${selectedConversation.userEmail}`} className="text-gray-400 hover:text-amber-600">
                          <FaEnvelope size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <FaReply className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl p-3 ${
                              msg.fromUserId === user?.id
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-[10px] mt-1 ${
                              msg.fromUserId === user?.id ? 'text-amber-100' : 'text-gray-400'
                            }`}>
                              {formatMessageTime(msg.createdAt)}
                              {msg.fromUserId === user?.id && (
                                <span className="ml-1">✓</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">Select a conversation</h3>
                    <p className="text-sm text-gray-500">Choose a customer to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AgentRoute>
  )
}