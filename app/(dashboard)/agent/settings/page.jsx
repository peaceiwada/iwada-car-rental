'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { updateUser } from '../../../lib/storage'
import { FaArrowLeft, FaSave, FaSpinner, FaUser, FaPhone, FaStore, FaMapMarkerAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AgentSettingsPage() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    businessAddress: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        businessName: user.agentVerification?.businessInfo?.businessName || user.businessName || '',
        businessAddress: user.agentVerification?.businessInfo?.businessAddress || user.businessAddress || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updates = {
        name: formData.name,
        phone: formData.phone,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        agentVerification: {
          ...user?.agentVerification,
          businessInfo: {
            businessName: formData.businessName,
            businessAddress: formData.businessAddress
          },
          contactInfo: {
            ...user?.agentVerification?.contactInfo,
            phone: formData.phone
          }
        }
      }
      const result = await updateProfile(updates)
      if (result.success) toast.success('Profile updated successfully!')
      else toast.error('Failed to update profile')
    } catch (error) {
      console.error(error)
      toast.error('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAgentVerified) return null

  return (
    <AgentRoute>
      <div className='p-6 max-w-4xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <Link href='/agent/dashboard'><FaArrowLeft className='text-gray-500 hover:text-amber-600' /></Link>
          <h1 className='text-2xl font-bold'>Settings</h1>
        </div>
        <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Full Name</label>
            <div className='relative'>
              <FaUser className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input name='name' value={formData.name} onChange={handleChange} className='w-full pl-10 pr-3 py-2 border rounded-lg' />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Phone Number</label>
            <div className='relative'>
              <FaPhone className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input name='phone' value={formData.phone} onChange={handleChange} className='w-full pl-10 pr-3 py-2 border rounded-lg' />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Business Name</label>
            <div className='relative'>
              <FaStore className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input name='businessName' value={formData.businessName} onChange={handleChange} className='w-full pl-10 pr-3 py-2 border rounded-lg' />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Business Address</label>
            <div className='relative'>
              <FaMapMarkerAlt className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input name='businessAddress' value={formData.businessAddress} onChange={handleChange} className='w-full pl-10 pr-3 py-2 border rounded-lg' />
            </div>
          </div>
          <button type='submit' disabled={loading} className='w-full bg-amber-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2'>
            {loading ? <FaSpinner className='animate-spin' /> : <FaSave />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AgentRoute>
  )
}
