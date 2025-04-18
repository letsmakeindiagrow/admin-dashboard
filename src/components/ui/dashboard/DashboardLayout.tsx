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
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64 h-screen flex flex-col bg-gray-50">
        <Header activeTab={activeTab} />
        <div className="flex-1 overflow-auto">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "investment" && <InvestmentContent />}
          {activeTab === "users" && <UsersContent />}
          {activeTab === "roles" && <RolesContent />}
        </div>
      </div>
    </>
  )
}