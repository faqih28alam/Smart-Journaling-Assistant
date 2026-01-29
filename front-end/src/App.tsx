// App.tsx
// src/App.tsx

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import type { Session } from '@supabase/supabase-js' 

import './App.css'

function App() {
  // 1. Tell TypeScript state can be Session or null
  const [session, setSession] = useState<Session | null>(null)
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe() // Cleanup listener
  }, [])

  const handleSave = async () => {
    if (!session) return; // Guard clause for TS

    const { error } = await supabase.from('entries').insert([
      { 
        raw_content: content, 
        user_id: session.user.id // Now TS knows session exists
      }
    ])

    if (error) {
      console.error("Error saving:", error.message)
      alert("Failed to save")
    } else {
      alert("Entry saved!")
      setContent('')
    }
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button 
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
        >
          Sign In with Google
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Smart Journaling</h1>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-500 underline"
        >
          Sign Out
        </button>
      </div>

      {/*<textarea 
        className="w-full border border-gray-300 p-3 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="How was your day? (Messy notes are fine, AI will tidy them up later!)"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
      />
      
      <button 
        onClick={handleSave}
        disabled={!content.trim()}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold transition-colors"
      >
        Save Entry
      </button>*/}

    </div>
  )
}

export default App