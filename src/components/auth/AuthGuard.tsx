import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Get all cookies and split them into an array
      const cookies = document.cookie.split(';');
      console.log("All cookies:", cookies);
      
      // Check if any cookie starts with 'admin_token='
      const isAuthenticated = cookies.some(cookie => 
        cookie.trim().startsWith('admin_token=')
      );
      
      const isLoginPage = location.pathname === "/login";
      console.log("Is authenticated:", isAuthenticated);
      console.log("Is login page:", isLoginPage);

      if (isAuthenticated && isLoginPage) {
        navigate("/");
      } else if (!isAuthenticated && !isLoginPage) {
        navigate("/login");
      }
    };

    // Check auth immediately
    checkAuth();

    // Also check after a short delay to ensure cookies are loaded
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return <>{children}</>;
}
