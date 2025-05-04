import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/ui/dashboard/DashboardLayout";
import LoginPage from "./components/auth/LoginPage";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AuthProvider } from "./components/auth/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthGuard>
                <LoginPage />
              </AuthGuard>
            }
          />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
