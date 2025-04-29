import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./components/ui/dashboard/DashboardLayout"
import LoginPage from "./components/auth/LoginPage"

function App() {
  const isAuthenticated = document.cookie.includes("isAuthenticated=true")

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="min-h-screen w-full">
                <DashboardLayout />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
