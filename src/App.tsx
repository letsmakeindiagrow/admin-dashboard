import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashboardLayout from "./components/ui/dashboard/DashboardLayout"
import LoginPage from "./components/auth/LoginPage"
import { AuthGuard } from "./components/auth/AuthGuard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <div className="min-h-screen w-full">
                <DashboardLayout />
              </div>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
