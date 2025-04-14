import { useState } from "react"
import {
  Activity,
  BarChart3,
  CheckCircle,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  PieChart,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white shadow-sm md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <PieChart className="h-6 w-6 text-[#AACF45]" />
            <span className="text-xl font-bold">InvestAdmin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                activeTab === "dashboard" && "bg-[#AACF45] text-white hover:text-white",
              )}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "investment" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                activeTab === "investment" && "bg-[#AACF45] text-white hover:text-white",
              )}
              onClick={() => setActiveTab("investment")}
            >
              <DollarSign className="h-4 w-4" />
              Investment Plans
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                activeTab === "users" && "bg-[#AACF45] text-white hover:text-white",
              )}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4" />
              User Management
            </Button>
            <Button
              variant={activeTab === "roles" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                activeTab === "roles" && "bg-[#AACF45] text-white hover:text-white",
              )}
              onClick={() => setActiveTab("roles")}
            >
              <Settings className="h-4 w-4" />
              User Roles
            </Button>
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "investment" && "Investment Plans"}
              {activeTab === "users" && "User Management"}
              {activeTab === "roles" && "User Roles"}
            </h1>
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

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Assets Under Management</CardTitle>
                  <DollarSign className="h-4 w-4 text-[#AACF45]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,546,000</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
                  <Users className="h-4 w-4 text-[#08AFF1]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,350</div>
                  <p className="text-xs text-muted-foreground">+180 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <BarChart3 className="h-4 w-4 text-[#AACF45]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">12 verification, 30 funds</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                  <CreditCard className="h-4 w-4 text-[#08AFF1]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">8 SIP, 7 Lumpsum</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="verification">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-[#f5f5f5]">
                    <TabsTrigger
                      value="verification"
                      className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white"
                    >
                      User Verification
                    </TabsTrigger>
                    <TabsTrigger
                      value="fund-add"
                      className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white"
                    >
                      Fund Add
                    </TabsTrigger>
                    <TabsTrigger
                      value="withdrawal"
                      className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white"
                    >
                      Fund Withdrawal
                    </TabsTrigger>
                  </TabsList>
                  <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">View All Requests</Button>
                </div>

                <TabsContent value="verification" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Verification Requests</CardTitle>
                      <CardDescription>Manage user verification requests here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Documents</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#08AFF1] text-white">{`U${i}`}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">User {i}</p>
                                    <p className="text-xs text-gray-500">user{i}@example.com</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{`${i} day${i > 1 ? "s" : ""} ago`}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-gray-100">
                                  ID + Address
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button size="sm" className="bg-[#AACF45] hover:bg-[#9abe3a]">
                                    Approve
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fund-add" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fund Addition Requests</CardTitle>
                      <CardDescription>Manage fund addition requests here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#08AFF1] text-white">{`U${i}`}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">User {i}</p>
                                    <p className="text-xs text-gray-500">user{i}@example.com</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>${(i * 1000).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-gray-100">
                                  {i % 2 === 0 ? "SIP Plan" : "Lumpsum"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button size="sm" className="bg-[#AACF45] hover:bg-[#9abe3a]">
                                    Approve
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="withdrawal" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Withdrawal Requests</CardTitle>
                      <CardDescription>Manage fund withdrawal requests here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3].map((i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#08AFF1] text-white">{`U${i}`}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">User {i}</p>
                                    <p className="text-xs text-gray-500">user{i}@example.com</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>${(i * 500).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-gray-100">
                                  {i % 2 === 0 ? "SIP Plan" : "Lumpsum"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button size="sm" className="bg-[#AACF45] hover:bg-[#9abe3a]">
                                    Approve
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        )}

        {/* Investment Plans Content */}
        {activeTab === "investment" && (
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Investment Plans</h2>
              <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">Add New Plan</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manage Investment Plans</CardTitle>
                <CardDescription>View and manage all investment plans here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search plans..." className="w-[250px]" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Filter</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>All Plans</DropdownMenuItem>
                        <DropdownMenuItem>SIP Only</DropdownMenuItem>
                        <DropdownMenuItem>Lumpsum Only</DropdownMenuItem>
                        <DropdownMenuItem>Active Only</DropdownMenuItem>
                        <DropdownMenuItem>Inactive Only</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>ROI (AAR)</TableHead>
                      <TableHead>ROI (AMR)</TableHead>
                      <TableHead>Min Investment</TableHead>
                      <TableHead>Term (Years)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Growth Fund",
                        roi: 12,
                        min: 5000,
                        term: 5,
                        type: "SIP",
                        active: true,
                      },
                      {
                        name: "Balanced Portfolio",
                        roi: 8.5,
                        min: 10000,
                        term: 3,
                        type: "Lumpsum",
                        active: true,
                      },
                      {
                        name: "High Yield Bond",
                        roi: 7.2,
                        min: 25000,
                        term: 7,
                        type: "Lumpsum",
                        active: true,
                      },
                      {
                        name: "Equity Plus",
                        roi: 14,
                        min: 1000,
                        term: 10,
                        type: "SIP",
                        active: true,
                      },
                      {
                        name: "Retirement Fund",
                        roi: 9,
                        min: 5000,
                        term: 15,
                        type: "SIP",
                        active: false,
                      },
                    ].map((plan, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{plan.roi}%</TableCell>
                        <TableCell>{(plan.roi / 12).toFixed(2)}%</TableCell>
                        <TableCell>${plan.min.toLocaleString()}</TableCell>
                        <TableCell>{plan.term}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              plan.type === "SIP" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                            }
                          >
                            {plan.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch id={`plan-status-${i}`} checked={plan.active} />
                            <Label htmlFor={`plan-status-${i}`} className="text-xs">
                              {plan.active ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        )}

        {/* User Management Content */}
        {activeTab === "users" && (
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
              <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">Add New User</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage all users from this panel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search users..." className="w-[250px]" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Filter</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>All Users</DropdownMenuItem>
                        <DropdownMenuItem>Active Users</DropdownMenuItem>
                        <DropdownMenuItem>Inactive Users</DropdownMenuItem>
                        <DropdownMenuItem>Verified Users</DropdownMenuItem>
                        <DropdownMenuItem>Unverified Users</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Investments</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#08AFF1] text-white">{`U${i}`}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">User {i}</p>
                              <p className="text-xs text-gray-500">user{i}@example.com</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            {i === 1 ? "Admin" : i === 2 ? "Manager" : "Investor"}
                          </Badge>
                        </TableCell>
                        <TableCell>${(i * 2500).toLocaleString()}</TableCell>
                        <TableCell>{`${i * 2} months ago`}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={i % 3 === 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}
                            >
                              {i % 3 === 0 ? "Pending" : "Verified"}
                            </Badge>
                            {i % 3 === 0 && (
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <CheckCircle className="h-4 w-4 text-[#AACF45]" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        )}

        {/* User Roles Content */}
        {activeTab === "roles" && (
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Roles</h2>
              <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">Add New Role</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manage Roles</CardTitle>
                <CardDescription>Configure user roles and permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Administrator",
                        description: "Full system access",
                        users: 2,
                        permissions: "All",
                      },
                      {
                        name: "Manager",
                        description: "Can manage users and investments",
                        users: 5,
                        permissions: "Users, Investments",
                      },
                      {
                        name: "Support",
                        description: "Can view and help users",
                        users: 8,
                        permissions: "View only",
                      },
                      {
                        name: "Investor",
                        description: "Regular user account",
                        users: 2350,
                        permissions: "Self management",
                      },
                    ].map((role, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            {role.permissions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
                <CardDescription>Configure what each role can access.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Administrator</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Support</TableHead>
                      <TableHead>Investor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        feature: "Dashboard",
                        admin: true,
                        manager: true,
                        support: true,
                        investor: false,
                      },
                      {
                        feature: "User Management",
                        admin: true,
                        manager: true,
                        support: true,
                        investor: false,
                      },
                      {
                        feature: "Investment Plans",
                        admin: true,
                        manager: true,
                        support: false,
                        investor: false,
                      },
                      {
                        feature: "Approvals",
                        admin: true,
                        manager: true,
                        support: false,
                        investor: false,
                      },
                      {
                        feature: "Reports",
                        admin: true,
                        manager: true,
                        support: true,
                        investor: false,
                      },
                      {
                        feature: "Settings",
                        admin: true,
                        manager: false,
                        support: false,
                        investor: false,
                      },
                    ].map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.feature}</TableCell>
                        <TableCell>
                          <Switch id={`admin-${i}`} checked={item.admin} />
                        </TableCell>
                        <TableCell>
                          <Switch id={`manager-${i}`} checked={item.manager} />
                        </TableCell>
                        <TableCell>
                          <Switch id={`support-${i}`} checked={item.support} />
                        </TableCell>
                        <TableCell>
                          <Switch id={`investor-${i}`} checked={item.investor} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        )}
      </div>
    </div>
  )
}
