// App.tsx

// Pages 
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"

// Components
import MainLayout from "./components/layout/MainLayout"
import { ThemeProviderWrapper } from "./components/theme-provider"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'            // The gatekeeper component
import { Navigate } from "react-router-dom"

//function for router
function App() {

  return (
    <BrowserRouter>
      <ThemeProviderWrapper>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/test" element={<Home />} />           */}
          </Route>

          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
      </ThemeProviderWrapper>
    </BrowserRouter>
  )
}

export default App