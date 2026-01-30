// Navbar.tsx
// src/components/layout/Navbar.tsx

import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react"; // Nice icons

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="font-bold text-xl tracking-tight">JournalAI</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleSignOut}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}