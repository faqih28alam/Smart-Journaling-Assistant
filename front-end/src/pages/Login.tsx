// Login.tsx
// src/pages/Login.tsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
      // If user is already logged in, don't let them see the login page
      const checkUser = async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session) navigate('/home')
      }
      checkUser()
    }, [navigate])

    const handleLogin = async (provider: 'github' | 'google') => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home` 
        }
      })
      if (error) alert(error.message)
    }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-3xl font-extrabold mb-2">Just Write It!</h1>
        <p className="text-gray-500 mb-8">Your thoughts, organized by AI.</p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('github')}
            className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <span>Sign In with GitHub</span>
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            onClick={() => handleLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Simple Google Icon placeholder or use an SVG */}
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login