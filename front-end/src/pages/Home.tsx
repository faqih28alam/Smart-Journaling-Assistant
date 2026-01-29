// Home.tsx
// src/pages/Home.tsx

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const Home = () => {

    // We can get the session from a context or directly from Supabase
    const [content, setContent] = useState<string>('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!content.trim()) return
        setIsSaving(true)

        try {
            // Use getUser() for security, as getSession() can be spoofed on the client
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error("Authentication session expired. Please log in again.")

            const { error } = await supabase.from('entries').insert([
            { 
                raw_content: content, 
                user_id: user.id 
            }
            ])

            if (error) throw error

            alert("Entry saved!")
            setContent('')
        } catch (error: any) {
            alert(error.message || "An error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <header>
                <h2 className="text-3xl font-bold text-gray-900">Daily Entry</h2>
                <p className="text-gray-500">Don't worry about grammar—just write. AI will organize it later.</p>
            </header>
            {/* Text Area */}
            <div className="relative">
                <textarea 
                className="w-full h-64 p-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all resize-none shadow-sm"
                placeholder="What's on your mind today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSaving}
                />
                
                {/* Character Count or Status Hint */}
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-mono">
                {content.length} characters
                </div>
            </div>
            {/* Save Button */}
            <button 
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg cursor-pointer 
                ${isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                }`}
            >
                {isSaving ? 'Saving...' : 'Lock in Entry'}
            </button>

            {/* Placeholder for "Previous Entries" or "AI Summary" later */}
            <div className="pt-10 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Activity</h3>
                <p className="mt-4 text-gray-400 italic text-sm">Your previous entries will appear here once you've written a few...</p>
            </div>  
        </div>
    )
}

export default Home