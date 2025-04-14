// components/dashboard/DashboardLayout.tsx
"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import DashboardContent from "./DashboardContent"
import InvestmentContent from "./InvestmentContent"
import UsersContent from "./UsersContent"
import RolesContent from "./RolesContent"

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1 flex-col">
        <Header activeTab={activeTab} />
        
        {activeTab === "dashboard" && <DashboardContent />}
        {activeTab === "investment" && <InvestmentContent />}
        {activeTab === "users" && <UsersContent />}
        {activeTab === "roles" && <RolesContent />}
      </div>
    </div>
  )
}