// components/dashboard/Sidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { PieChart, LayoutDashboard, DollarSign, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "investment", icon: DollarSign, label: "Investment Plans" },
    { id: "users", icon: Users, label: "User Management" },
    { id: "roles", icon: Settings, label: "User Roles" },
  ]

  return (
    <div className="hidden w-64 flex-col bg-white shadow-sm md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <PieChart className="h-6 w-6 text-[#AACF45]" />
          <span className="text-xl font-bold">InvestAdmin</span>
        </a>
      </div>
      
      {/* Rest of the component remains the same */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                activeTab === tab.id && "bg-[#AACF45] text-white hover:text-white"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback className="bg-[#08AFF1] text-white">AD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}