'use client'

// Agent database using localStorage for persistence
const AGENTS_STORAGE_KEY = 'iwada_agents'
const VERIFICATION_REQUESTS_KEY = 'iwada_verification_requests'

// Initialize default agents if none exist
const initializeAgentData = () => {
  if (typeof window === 'undefined') return
  
  const existingAgents = localStorage.getItem(AGENTS_STORAGE_KEY)
  if (!existingAgents) {
    const defaultAgents = [
      {
        id: 3,
        name: 'Demo Agent',
        email: 'agent@example.com',
        phone: '+234 123 456 7890',
        whatsapp: '+234 123 456 7890',
        role: 'agent',
        agentStatus: 'pending',
        isVerified: false,
        verificationMessage: 'Your account is pending admin verification.',
        businessName: 'Premium Car Rentals',
        businessAddress: 'Lagos, Nigeria',
        registrationDate: '2024-01-20T10:00:00Z',
        verifiedAt: null,
        verifiedBy: null,
        documents: { idType: 'National ID', idNumber: 'NGN123456789', status: 'pending' },
        contactDetails: { phone: '+234 123 456 7890', whatsapp: '+234 123 456 7890', email: 'agent@example.com', address: 'Lagos, Nigeria' },
        stats: { totalOrders: 0, totalRevenue: 0, totalRatings: 0, averageRating: 0 }
      },
      {
        id: 4,
        name: 'Verified Agent',
        email: 'verified@example.com',
        phone: '+234 987 654 3210',
        whatsapp: '+234 987 654 3210',
        role: 'agent',
        agentStatus: 'verified',
        isVerified: true,
        verificationMessage: 'Your account has been verified! You can now post cars for rent.',
        businessName: 'Elite Auto Rentals',
        businessAddress: 'Victoria Island, Lagos',
        registrationDate: '2024-01-15T10:00:00Z',
        verifiedAt: '2024-01-16T14:30:00Z',
        verifiedBy: 'Admin User',
        documents: { idType: 'International Passport', idNumber: 'A12345678', status: 'approved' },
        contactDetails: { phone: '+234 987 654 3210', whatsapp: '+234 987 654 3210', email: 'verified@example.com', address: 'Victoria Island, Lagos' },
        stats: { totalOrders: 24, totalRevenue: 450000, totalRatings: 18, averageRating: 4.7 }
      }
    ]
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(defaultAgents))
  }
}

// Get all pending verification requests
export const getPendingVerificationRequests = () => {
  if (typeof window === 'undefined') return []
  initializeAgentData()
  const agents = JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
  return agents.filter(agent => agent.agentStatus === 'pending' || agent.agentStatus === 'pending_document_review')
}

// Get all agents
export const getAllAgents = () => {
  if (typeof window === 'undefined') return []
  initializeAgentData()
  return JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
}

// Get agent by ID
export const getAgentById = (agentId) => {
  if (typeof window === 'undefined') return null
  initializeAgentData()
  const agents = JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
  return agents.find(agent => agent.id === parseInt(agentId))
}

// Get agent by email
export const getAgentByEmail = (email) => {
  if (typeof window === 'undefined') return null
  initializeAgentData()
  const agents = JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
  return agents.find(agent => agent.email === email)
}

// Register a new agent
export const registerAgent = (agentData) => {
  if (typeof window === 'undefined') return null
  initializeAgentData()
  
  const agents = JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
  
  const newAgent = {
    id: Date.now(),
    name: agentData.name,
    email: agentData.email,
    phone: agentData.phone,
    whatsapp: agentData.phone,
    role: 'agent',
    agentStatus: 'pending',
    isVerified: false,
    verificationMessage: 'Your account is pending admin verification. Please wait for approval.',
    businessName: agentData.businessName || '',
    businessAddress: agentData.businessAddress || '',
    registrationDate: new Date().toISOString(),
    verifiedAt: null,
    verifiedBy: null,
    documents: { idType: null, idNumber: null, status: 'pending' },
    contactDetails: { phone: agentData.phone, whatsapp: agentData.phone, email: agentData.email, address: agentData.businessAddress || '' },
    stats: { totalOrders: 0, totalRevenue: 0, totalRatings: 0, averageRating: 0 }
  }
  
  agents.push(newAgent)
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents))
  return newAgent
}

// Verify an agent (Approve) - UPDATED to sync with current session
export const verifyAgent = (agentId, adminName, verificationNotes = '') => {
  if (typeof window === 'undefined') return null
  initializeAgentData()
  
  const agents = JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
  const agentIndex = agents.findIndex(a => a.id === parseInt(agentId))
  
  if (agentIndex !== -1) {
    const verifiedAgent = {
      ...agents[agentIndex],
      agentStatus: 'verified',
      isVerified: true,
      verificationMessage: 'Your account has been verified! You can now post cars for rent.',
      verifiedAt: new Date().toISOString(),
      verifiedBy: adminName,
      documents: {
        ...agents[agentIndex].documents,
        status: 'approved',
        approvedBy: adminName,
        approvedAt: new Date().toISOString(),
        verificationNotes
      }
    }
    
    agents[agentIndex] = verifiedAgent
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents))
    
    // CRITICAL FIX: Update the current logged-in user's session if they are this agent
    const currentUser = localStorage.getItem('iwada_user')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id === parseInt(agentId) || user.email === verifiedAgent.email) {
        localStorage.setItem('iwada_user', JSON.stringify(verifiedAgent))
        console.log('✅ Agent session updated in localStorage')
      }
    }
    
    return { success: true, agent: verifiedAgent }
  }
  
  return { success: false, error: 'Agent not found' }
}

// Reject an agent - UPDATED to sync with current session
export const rejectAgent = (agentId, adminName, reason = '') => {
  if (typeof window === 'undefined') return null
  initializeAgentData()
  
  const agents = JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || '[]')
  const agentIndex = agents.findIndex(a => a.id === parseInt(agentId))
  
  if (agentIndex !== -1) {
    const rejectedAgent = {
      ...agents[agentIndex],
      agentStatus: 'rejected',
      isVerified: false,
      verificationMessage: `Your agent application was rejected. Reason: ${reason || 'Please contact support for more information.'}`,
      rejectedAt: new Date().toISOString(),
      rejectedBy: adminName,
      rejectionReason: reason,
      documents: { ...agents[agentIndex].documents, status: 'rejected', rejectedBy: adminName, rejectedAt: new Date().toISOString(), rejectionReason: reason }
    }
    
    agents[agentIndex] = rejectedAgent
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents))
    
    // CRITICAL FIX: Update the current logged-in user's session if they are this agent
    const currentUser = localStorage.getItem('iwada_user')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id === parseInt(agentId) || user.email === rejectedAgent.email) {
        localStorage.setItem('iwada_user', JSON.stringify(rejectedAgent))
        console.log('✅ Agent session updated in localStorage')
      }
    }
    
    return { success: true, agent: rejectedAgent }
  }
  
  return { success: false, error: 'Agent not found' }
}

// Sync agent status - Call this when agent logs in
export const syncAgentStatus = (email) => {
  if (typeof window === 'undefined') return null
  initializeAgentData()
  
  const agent = getAgentByEmail(email)
  if (agent) {
    const currentUser = localStorage.getItem('iwada_user')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.email === email) {
        localStorage.setItem('iwada_user', JSON.stringify(agent))
        return agent
      }
    }
  }
  return null
}

// Force refresh agent session - Call after admin verification
export const refreshAgentSession = (agentEmail) => {
  if (typeof window === 'undefined') return null
  const agent = getAgentByEmail(agentEmail)
  if (agent) {
    const currentUser = localStorage.getItem('iwada_user')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.email === agentEmail) {
        localStorage.setItem('iwada_user', JSON.stringify(agent))
        return agent
      }
    }
  }
  return null
}
export const getPendingAgents = () => {
  return agentsDatabase.registered.filter(agent => agent.agentStatus === 'pending' || agent.agentStatus === 'pending_document_review')
}