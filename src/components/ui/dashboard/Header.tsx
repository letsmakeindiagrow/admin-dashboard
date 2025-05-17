// components/dashboard/Header.tsx
import { Button } from "@/components/ui/button";
import { Activity, LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  activeTab: string;
}

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard",
  investment: "Investment Plans",
  users: "User Management",
  roles: "User Roles",
};

export default function Header({ activeTab }: HeaderProps) {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout response:", response.data);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="md:hidden">
        <LayoutDashboard className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">{tabTitles[activeTab]}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Activity className="h-5 w-5" />
          <span className="sr-only">Activity</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback className="bg-[#08AFF1] text-white">
                  👤
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Administrator</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
