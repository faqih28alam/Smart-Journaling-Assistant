// Navbar.tsx
// src/components/layout/Navbar.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Moon, Sun } from "lucide-react"; // Nice icons

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // 1. Listen for Auth Changes
  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for sign-in/sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleToggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="font-bold text-xl tracking-tight">JournalAI</span>
          </div>

          <div className="flex items-center gap-4">

            {/* Conditional Rendering: Only show if user is logged in */}
            {user && (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  // Adjusted colors to work in both light and dark mode
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleDarkMode}
              className="text-muted-foreground"
            >
              {document.documentElement.classList.contains("dark") ? (
                <Sun className="w-4 h-4 mr-2" />
              ) : (
                <Moon className="w-4 h-4 mr-2" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}