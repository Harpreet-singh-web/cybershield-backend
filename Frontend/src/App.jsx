import { BrowserRouter, Routes, Route }
from "react-router-dom"

import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import UserDashboard from "./pages/UserDashboard"
import ThreatDashboard from "./pages/ThreatDashboard"

function App(){

  return (

    <BrowserRouter>

      <Routes>

        {/* AUTH PAGE */}
        <Route
          path="/"
          element={<Auth />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<Dashboard />}
        />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={<UserDashboard />}
        />

        {/* THREAT DASHBOARD */}
        <Route
          path="/threat-dashboard"
          element={<ThreatDashboard />}
        />
      </Routes>

    </BrowserRouter>
  )
}

export default App