// Navbar.tsx
// src/components/layout/Navbar.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Sun, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Navbar() {
  const navigate = useNavigate();
  // We'll store the profile data here
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  // Listen for Auth Changes to handle UI visibility
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  // Editable fields state
  const [editName, setEditName] = useState("");

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
      setEditName(data.name || "");
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('http://localhost:3000/api/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        // ADD userId HERE:
        body: JSON.stringify({
          userId: sessionUser.id,
          name: editName
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.user);
        alert("Profile updated!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
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
          <div className="flex items-center gap-2 cursor-pointer">
            <Link className="flex items-center gap-2" to="/">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">Journal<span className="text-indigo-600">AI</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {sessionUser && (
              <>
                <Dialog onOpenChange={(open) => open && fetchProfile()}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="...">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your display name here.
                      </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                      <p className="py-4 text-sm animate-pulse">Loading...</p>
                    ) : (
                      <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={profile?.email || ""} disabled className="bg-muted" />
                          <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Your Name"
                          />
                        </div>

                        <Button type="submit" className="w-full" disabled={isUpdating}>
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
              className="text-muted-foreground cursor-pointer"
            >
              {/* Note Later: you'd want a state-based check for the icon */}
              <Sun className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}