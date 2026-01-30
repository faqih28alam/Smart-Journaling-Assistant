// ProtectedRoute.tsx
// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return null; // Or a spinner
  return session ? <Outlet /> : <Navigate to="/login" />;
}