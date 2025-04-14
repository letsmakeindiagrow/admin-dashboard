// components/dashboard/Header.tsx
import { Button } from "@/components/ui/button"
import { Activity, LayoutDashboard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  activeTab: string
}

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard",
  investment: "Investment Plans",
  users: "User Management",
  roles: "User Roles"
}

export default function Header({ activeTab }: HeaderProps) {
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
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback className="bg-[#08AFF1] text-white">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}