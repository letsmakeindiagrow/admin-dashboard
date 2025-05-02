// components/dashboard/UsersContent.tsx
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import UserTableRow from "./UserTableRow"
import axios from "axios"

interface User {
  id: string
  email: string
  availableBalance: number
  verificationState: string
  createdAt: string
}

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const fetchUsers = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL
      if (!baseUrl) {
        console.error("API base URL is not defined in environment variables.")
        return
      }
      const response = await axios.get(`${baseUrl}/api/v1/admin/get-users`, {
        withCredentials: true,
      })
      if (response.status === 200) {
        console.log("Users data:", response.data.users)
        setUsers(response.data.users || [])
      } else {
        console.error("Failed to fetch users:", response.status, response.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    
    if (filter === "all") return matchesSearch
    if (filter === "verified") return matchesSearch && user.verificationState === "VERIFIED"
    if (filter === "pending") return matchesSearch && user.verificationState === "PENDING"
    if (filter === "rejected") return matchesSearch && user.verificationState === "REJECTED"
    
    return matchesSearch
  })

  return (
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
              <Input 
                placeholder="Search users..." 
                className="w-[250px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("all")}>All Users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("verified")}>Verified Users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("pending")}>Pending Users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("rejected")}>Rejected Users</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow key={user.id} user={user} onVerify={fetchUsers} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}