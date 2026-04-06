import { NextResponse } from 'next/server'
import { verifyAgent, rejectAgent, getPendingAgents } from '../../../lib/agentStorage'

export async function POST(request) {
  try {
    const { agentId, action, adminName, reason } = await request.json()
    
    if (action === 'verify') {
      const result = verifyAgent(agentId, adminName)
      if (result.success) {
        return NextResponse.json({ success: true, agent: result.agent })
      }
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 })
    }
    
    if (action === 'reject') {
      const result = rejectAgent(agentId, adminName, reason)
      if (result.success) {
        return NextResponse.json({ success: true, agent: result.agent })
      }
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const pendingAgents = getPendingAgents()
    return NextResponse.json({ success: true, agents: pendingAgents })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}