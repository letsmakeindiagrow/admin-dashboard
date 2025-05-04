import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === null) {
      // Still loading, optionally show a spinner
      return;
    }
    const isLoginPage = location.pathname === "/login";
    if (isAuthenticated && isLoginPage) {
      navigate("/");
    } else if (!isAuthenticated && !isLoginPage) {
      navigate("/login");
    }
    // Optionally, re-check auth on certain events
    // checkAuth();
  }, [isAuthenticated, location.pathname, navigate]);

  if (isAuthenticated === null) return null; // or a loading spinner

  return <>{children}</>;
}
