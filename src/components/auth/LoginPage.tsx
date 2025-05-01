import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        // No need to set cookie here, backend handles it (httpOnly)
        navigate("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Use error message from backend if available
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
      } else {
        // Generic error message for network issues or other errors
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", err); // Keep console log for debugging
    }

    // // For demo purposes, using hardcoded credentials - REMOVE THIS BLOCK
    // if (email === "admin@aadyanviwealth.com" && password === "admin123") {
    //   // Set authentication cookie
    //   document.cookie = "isAuthenticated=true; path=/; max-age=86400" // 24 hours
    //   navigate("/")
    // } else {
    //   setError("Invalid email or password")
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
