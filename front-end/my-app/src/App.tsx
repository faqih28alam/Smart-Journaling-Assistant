// App.tsx

// Pages 
// import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"

// Components
import MainLayout from "./components/layout/MainLayout"

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute' // The gatekeeper component
// import { Navigate } from "react-router-dom"

//function for router
function App() {

  return (
    <BrowserRouter>
        <Routes>

          {/* AUTH ROUTES (No Header) */}

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/test" element={<Home />} />           */}

          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              {/* <Route path="/follows" element={<Follow />} /> */}
            </Route>
          </Route>

          {/* Fallback */}
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          
        </Routes>
    </BrowserRouter>
  )
}

export default App