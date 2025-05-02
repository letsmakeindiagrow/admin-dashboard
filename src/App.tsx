import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashboardLayout from "./components/ui/dashboard/DashboardLayout"
import LoginPage from "./components/auth/LoginPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen w-full">
              <DashboardLayout />
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
