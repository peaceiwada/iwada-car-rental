'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getMessages, saveMessage } from '../../../lib/storage'
import { formatDate } from '../../../lib/constants'
import { FaArrowLeft, FaUser, FaPaperPlane, FaSpinner } from 'react-icons/fa'

export default function AgentMessagesPage() {
  const { user, isAgentVerified } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isAgentVerified && user) loadConversations()
  }, [isAgentVerified, user])

  const loadConversations = () => {
    try {
      const allMessages = getMessages()
      const unique = new Map()
      allMessages.forEach(msg => {
        if (msg.toUserId === user.id && !unique.has(msg.fromUserId)) {
          unique.set(msg.fromUserId, { id: msg.fromUserId, name: msg.fromUserName })
        }
      })
      setConversations(Array.from(unique.values()))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = (userId) => {
    const all = getMessages()
    const filtered = all.filter(m =>
      (m.fromUserId === userId && m.toUserId === user.id) ||
      (m.fromUserId === user.id && m.toUserId === userId)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    setMessages(filtered)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return
    setSending(true)
    try {
      const msg = {
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: selectedUser.id,
        toUserName: selectedUser.name,
        message: newMessage.trim()
      }
      const saved = saveMessage(msg)
      if (saved) {
        setNewMessage('')
        loadMessages(selectedUser.id)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  if (!isAgentVerified) return null
  if (loading) return <div className='p-6 text-center'>Loading...</div>

  return (
    <AgentRoute>
      <div className='p-6 max-w-7xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <Link href='/agent/dashboard'><FaArrowLeft className='text-gray-500 hover:text-amber-600' /></Link>
          <h1 className='text-2xl font-bold'>Messages</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]'>
          <div className='bg-white rounded-xl shadow border overflow-y-auto p-2'>
            {conversations.map(c => (
              <button key={c.id} onClick={() => { setSelectedUser(c); loadMessages(c.id); }} className='w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center'><FaUser className='text-amber-600' /></div>
                <span className='font-semibold'>{c.name}</span>
              </button>
            ))}
          </div>
          <div className='md:col-span-2 bg-white rounded-xl shadow border flex flex-col'>
            {selectedUser ? (
              <>
                <div className='p-3 border-b bg-gray-50 font-semibold'>Chat with {selectedUser.name}</div>
                <div className='flex-1 overflow-y-auto p-3 space-y-2'>
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.fromUserId === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-2 ${m.fromUserId === user.id ? 'bg-amber-500 text-white' : 'bg-gray-100'}`}>
                        <p className='text-sm'>{m.message}</p>
                        <p className='text-xs opacity-70 mt-1'>{formatDate(m.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='p-3 border-t flex gap-2'>
                  <input type='text' value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder='Type a message...' className='flex-1 border rounded-lg px-3 py-2' />
                  <button onClick={sendMessage} disabled={sending} className='bg-amber-500 text-white px-4 py-2 rounded-lg'>
                    {sending ? <FaSpinner className='animate-spin' /> : <FaPaperPlane />}
                  </button>
                </div>
              </>
            ) : (
              <div className='flex-1 flex items-center justify-center text-gray-500'>Select a conversation</div>
            )}
          </div>
        </div>
      </div>
    </AgentRoute>
  )
}
