// Navbar.tsx
// src/components/layout/Navbar.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Sun, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Navbar() {
  const navigate = useNavigate();
  // We'll store the profile data here
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for Auth Changes to handle UI visibility
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch detailed profile data from your 'User' table
  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return;

    const { data, error } = await supabase
      .from('User') // Ensure this matches your table name exactly
      .select('email, name')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error("Error fetching user:", error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Redirect to landing page after sign out
    navigate("/");
  };

  const handleToggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Journal App</span>
          </div>

          <div className="flex items-center gap-4">
            {sessionUser && (
              <>
                <Dialog onOpenChange={(open) => open && fetchProfile()}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Profile Information</DialogTitle>
                      <DialogDescription>
                        Details linked to your account.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Displaying the Data */}
                    <div className="py-4 space-y-4">
                      {loading ? (
                        <p className="text-sm text-muted-foreground animate-pulse">Loading profile...</p>
                      ) : profile ? (
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-medium uppercase text-muted-foreground">Name</label>
                            <p className="text-sm font-semibold">{profile.name || "N/A"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium uppercase text-muted-foreground">Email</label>
                            <p className="text-sm font-semibold">{profile.email}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-destructive">Could not load profile data.</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
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
              {/* Note: In a real app, you'd want a state-based check for the icon */}
              <Sun className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}