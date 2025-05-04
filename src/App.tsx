import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/ui/dashboard/DashboardLayout";
import LoginPage from "./components/auth/LoginPage";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AuthProvider } from "./components/auth/AuthContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthProvider>
              <AuthGuard>
                <LoginPage />
              </AuthGuard>
            </AuthProvider>
          }
        />
        <Route
          path="/"
          element={
            <AuthProvider>
              <AuthGuard>
                <div className="min-h-screen w-full">
                  <DashboardLayout />
                </div>
              </AuthGuard>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
