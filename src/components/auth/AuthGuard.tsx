import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = document.cookie.includes("admin_token");
    const isLoginPage = location.pathname === "/login";

    if (isAuthenticated && isLoginPage) {
      navigate("/");
    } else if (!isAuthenticated && !isLoginPage) {
      navigate("/login");
    }
  }, [navigate, location]);

  return <>{children}</>;
}
