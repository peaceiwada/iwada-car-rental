'use client'

import { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaStop, FaQuestionCircle } from 'react-icons/fa'

export default function VoiceSearch({ onSearch }) {
  const [showHelp, setShowHelp] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const commands = [
    { command: '"Toyota Camry"', result: 'Searches for Toyota Camry' },
    { command: '"Toyota Corolla"', result: 'Searches for Toyota Corolla' },
    { command: '"SUVs in Lagos"', result: 'Shows SUVs in Lagos' },
    { command: '"Cars under 30000"', result: 'Shows cars below ₦30,000' },
    { command: '"Automatic transmission"', result: 'Shows automatic cars' },
    { command: '"Available cars"', result: 'Shows available cars only' },
    { command: '"Highest rated"', result: 'Sorts by rating' },
  ]

  useEffect(() => {
    // Initialize speech recognition only once
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
      }
      
      recognitionInstance.onresult = (event) => {
        const text = event.results[0][0].transcript
        setTranscript(text)
        handleVoiceSearch(text)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionRef.current = recognitionInstance
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore stop errors on cleanup
        }
      }
    }
  }, [])

  const handleVoiceSearch = (text) => {
    console.log('Voice command:', text)
    const lowerText = text.toLowerCase()
    
    // FIRST: Check if it's a specific car model search (Toyota Corolla, Honda Accord, etc.)
    const carModels = [
      'toyota camry', 'camry',
      'toyota corolla', 'corolla',
      'honda accord', 'accord',
      'lexus rx', 'lexus',
      'mercedes', 'mercedes benz',
      'hyundai santa fe', 'hyundai',
      'kia picanto', 'kia',
      'toyota hilux', 'hilux'
    ]
    
    for (const model of carModels) {
      if (lowerText.includes(model)) {
        // Just pass the search term without any filter type
        onSearch(text, null)
        return
      }
    }
    
    // Check for price commands
    const priceMatch = lowerText.match(/(?:under|below|less than)\s+(\d+)/)
    if (priceMatch) {
      const price = parseInt(priceMatch[1])
      onSearch(text, { type: 'price', value: price })
      return
    }
    
    // Check for car type commands
    const carTypes = ['sedan', 'suv', 'luxury', 'economy', 'sports', 'van']
    for (const type of carTypes) {
      if (lowerText.includes(type)) {
        onSearch(text, { type: 'carType', value: type })
        return
      }
    }
    
    // Check for location commands
    const locations = ['lagos', 'abuja', 'port harcourt']
    for (const location of locations) {
      if (lowerText.includes(location)) {
        onSearch(text, { type: 'location', value: location })
        return
      }
    }
    
    // Check for transmission commands
    if (lowerText.includes('automatic')) {
      onSearch(text, { type: 'transmission', value: 'automatic' })
      return
    }
    if (lowerText.includes('manual')) {
      onSearch(text, { type: 'transmission', value: 'manual' })
      return
    }
    
    // Check for availability commands
    if (lowerText.includes('available')) {
      onSearch(text, { type: 'availability', value: 'available' })
      return
    }
    
    // Check for sort commands
    if (lowerText.includes('highest rated') || lowerText.includes('top rated')) {
      onSearch(text, { type: 'sort', value: 'rating' })
      return
    }
    
    // Default: just search the text as a regular search query
    onSearch(text)
  }

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        // Check if already listening
        if (isListening) {
          console.log('Already listening, stopping first...')
          recognitionRef.current.stop()
          setTimeout(() => {
            try {
              setTranscript('')
              recognitionRef.current.start()
            } catch (error) {
              console.error('Error starting after stop:', error)
            }
          }, 100)
        } else {
          setTranscript('')
          recognitionRef.current.start()
        }
      } catch (error) {
        console.error('Error starting recognition:', error)
        setIsListening(false)
        alert('Could not start voice recognition. Please try again.')
      }
    } else {
      alert('Speech recognition is not supported in your browser')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Error stopping recognition:', error)
      }
      setIsListening(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Microphone button for voice input */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-full transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-lg' 
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice search'}
        >
          {isListening ? <FaStop size={16} /> : <FaMicrophone size={16} />}
        </button>
        
        {/* Help button */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Voice search help"
        >
          <FaQuestionCircle size={16} />
        </button>
      </div>
      
      {/* Listening status indicator */}
      {isListening && (
        <div className="absolute left-0 top-full mt-2 bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-md whitespace-nowrap z-50 animate-pulse">
          🎤 Listening... Speak now
        </div>
      )}
      
      {/* Transcript display */}
      {transcript && !isListening && (
        <div className="absolute left-0 top-full mt-2 bg-green-50 text-green-600 text-xs px-3 py-1.5 rounded-md whitespace-nowrap z-50">
          🎤 Searched: "{transcript}"
        </div>
      )}
      
      {/* Help panel */}
      {showHelp && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
          
          {/* Help panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaMicrophone className="text-amber-500" /> Voice Search Commands
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {commands.map((cmd, idx) => (
                <div key={idx} className="text-sm">
                  <code className="bg-gray-100 px-2 py-1 rounded text-amber-600 block mb-1">{cmd.command}</code>
                  <p className="text-gray-500 text-xs">{cmd.result}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
              Click the microphone button and speak naturally
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="mt-3 text-xs text-amber-600 hover:text-amber-700 w-full text-center"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  )
}