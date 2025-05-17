// components/dashboard/Sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, DollarSign, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "investment", icon: DollarSign, label: "Investment Plans" },
    { id: "users", icon: Users, label: "User Management" },
    { id: "roles", icon: Settings, label: "User Roles" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex-col bg-white shadow-sm hidden md:flex">
      {/* Logo */}
      <div className="flex h-20 items-center border-b px-4 justify-center">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <img src="/logo.png" alt="Logo" className="pl-3 h-50 w-auto" />
        </a>
      </div>

      {/* Main Nav */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <nav className="px-2 pt-4 pb-2 text-base font-semibold space-y-1 overflow-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-gray-900 text-lg justify-start",
                activeTab === tab.id &&
                  "bg-[#AACF45] text-white hover:text-white shadow-md"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </Button>
          ))}
        </nav>

        {/* User Info pinned at bottom */}
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback className="bg-[#08AFF1] text-white">
                AWM
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-xs text-gray-500">admin@aadyanviwealth.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
