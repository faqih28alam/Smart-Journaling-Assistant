// App.tsx
// src/App.tsx

// Pages 
import Login from "./pages/Login"
import Home from './pages/Home'

// Components
import MainLayout from "./components/layout/MainLayout"
import ProtectedRoute from './components/ProtectedRoute' 

// Routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- AUTH ROUTES (No Header/Sidebar) --- */}
        <Route path="/login" element={<Login />} />

        {/* --- PRIVATE ROUTES (Requires Login) --- */}
        <Route element={<ProtectedRoute />}>
          {/* MainLayout provides the persistent Nav/Header for these pages */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            {/* Add more private pages like /profile or /settings here */}
          </Route>
        </Route>

        {/* --- FALLBACKS --- */}
        {/* Redirect root to /home. If not logged in, ProtectedRoute will then kick them to /login */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* 404 Catch-all (Optional) */}
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App