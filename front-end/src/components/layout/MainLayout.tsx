// MainLayout.tsx
// src/components/layout/MainLayout.tsx

import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

const MainLayout = () => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shared Navigation Bar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/home')}>
          Smart Journal
        </h1>
        {/* Sign Out Button */}
        <button 
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </nav>

      {/* This is where Home will render */}
      <main className="p-6 max-w-4xl mx-auto">
        <Outlet /> 
      </main>

    </div>
  )
}

export default MainLayout